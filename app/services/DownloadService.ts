// Service to get user data from Firebase
// TODO: These functions are very similar, so they should be refactored

import { CommentData, Post } from "../models/Post";
import { auth, db } from "./firebaseconfig";
import { 
    doc,
    collection,
    getDocs,
    getDoc
} from "firebase/firestore/lite";
import { User } from "../models/User";

const DownloadService = (() => {

      const getCurrentUser = async () => {
        return new Promise<User>((resolve, reject) => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
              getUserById(user.uid)
              .then((userData) => {
                resolve(userData);
              })
              .finally(() => {
                unsubscribe(); // Stop listening after getting the user data
              });
            } else {
              reject(new Error('No user signed in'));
              unsubscribe(); // Stop listening if there's no user
            }
          });
        });
      };

      const getOtherUsers = async () => {
        return new Promise<User[]>((resolve, reject) => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
              const usersRef = collection(db, 'users');
              const users: User[] = [];
      
              getDocs(usersRef)
                .then((querySnapshot) => {
                  if (querySnapshot.empty) {
                    reject(new Error('No users found'));
                  }

                  querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    
                    // Get posts from other users
                    // TODO: see if you find time to refactor
                    const posts: Post[] = [];
                    const promise = getUserPosts(doc.id).then((postElements) => {
                      return postElements;
                    });
                    promise.then((postElements) => {
                      postElements.forEach((postElement) => {
                        posts.push(postElement);
                      });
                    });

                      // Complete the fields
                      const currentOtherUser: User = {
                        uid: doc.id,
                        bio: userData.bio,
                        email: userData.email,
                        followers: userData.followersCount,
                        following: userData.followingCount,
                        profilePicture: userData.image,
                        displayName: userData.name,
                        userName: userData.userName,
                        posts: posts,
                      };
  
                      if (currentOtherUser.uid !== user.uid) {
                        users.push(currentOtherUser);
                      }
                  });
                  resolve(users);
                })
                .catch((error) => {
                  reject(new Error('Error getting users: ' + error));
                })
                .finally(() => {
                  unsubscribe(); // Stop listening after getting the user data
                });
            } else {
              reject(new Error('No user signed in'));
              unsubscribe(); // Stop listening if there's no user
            }
          });
        });
      };

      const getUserById = async (userId: string) => {
        return new Promise<User>((resolve, reject) => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
              const userDocRef = doc(db, 'users', userId);

              getDoc(userDocRef)
                .then((querySnapshot) => {
                  if (querySnapshot.exists()) {

                    const userData = querySnapshot.data();

                    // Get posts from current user
                    const posts: Post[] = [];
                    getUserPosts(userId)
                      .then((postElements) => {
                        postElements.forEach((postElement) => {
                          posts.push(postElement);
                        });
                      })
                      .catch((error) => {
                        console.error('Error getting other user posts:', error);
                      })
                      .finally(() => {
                        
                      const user: User = {
                        uid: auth.currentUser?.uid,
                        bio: userData.bio,
                        email: userData.email,
                        followers: userData.followersCount,
                        following: userData.followingCount,
                        profilePicture: userData.image,
                        displayName: userData.name,
                        userName: userData.userName,
                        posts: posts,
                      };
                      resolve(user);
                    });
                  } else {
                    reject(new Error('User document not found'));
                  }
                })
                .catch((error) => {
                  reject(new Error('Error getting document: ' + error));
                })
                .finally(() => {
                  unsubscribe(); // Stop listening after getting the user data
                });
            } else {
              reject(new Error('No user signed in'));
              unsubscribe(); // Stop listening if there's no user
            }
          });
        });
      };

      const getUserPosts = async (userId: string) => {
          const userPosts: Post[] = [];
          const userPostsCollectionRef = collection(db, `users/${userId}/posts`);

          const userPostsSnapshot = await getDocs(userPostsCollectionRef);
          if (userPostsSnapshot.empty) {
            console.log("No posts for user: " + userId)
            return [];
          }
          
          const documents = userPostsSnapshot.docs;
          for (const postDoc of documents) {
            const postData = postDoc.data();
            const comments = await getPostComments(userId, postDoc.id);

            const post: Post = {
              imageName: postData.imageName,
              imageUrl: postData.imageUrl,
              createdAt: postData.createdAt,
              location: postData.location,
              description: postData.description,
              comments: comments,
            };

            userPosts.push(post);
          };

          return userPosts;
      };

      const getPostComments = async (userId: string, postId: string) => {
        try {
          const postComments: CommentData[] = [];
          const postCommentsCollectionRef = collection(db, `users/${userId}/posts/${postId}/comments`);
          const postCommentsSnapshot = await getDocs(postCommentsCollectionRef);
      
          postCommentsSnapshot.forEach((commentDoc) => {
            const commentData = commentDoc.data();
            const comment: CommentData = {
              author: commentData.author,
              text: commentData.text,
              date: commentData.date,
            };
            postComments.push(comment);
          });

          return postComments;
        } catch (error) {
          console.error('Error getting post comments:', error);
          return [];
        }
      };

      return {
        getCurrentUser,
        getOtherUsers,
        getUserById,
      };
})();

export default DownloadService;