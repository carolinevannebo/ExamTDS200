// Service to get data from backend
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
/*
    const getCurrentUser = () => {
        return new Promise<User>((resolve, reject) => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
              const userDocRef = doc(db, 'users', user.uid);

              getDoc(userDocRef)
                .then((querySnapshot) => {
                  if (querySnapshot.exists()) {

                    const userData = querySnapshot.data();

                    // Get posts from current user
                    const posts: Post[] = [];
                    getUserPosts(querySnapshot.id)
                      .then((postElements) => {
                        postElements.forEach((postElement) => {
                          posts.push(postElement);
                        });
                      });

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

                    console.log("current user has post count: " + user.posts.length);
                    resolve(user);

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
*/
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
                    // Note, this might be redundant, but it works so LEAVE IT ALONE
                    const posts: Post[] = [];
                    const promise = getUserPosts(doc.id).then((postElements) => {
                      return postElements;
                    });
                    promise.then((postElements) => {
                      postElements.forEach((postElement) => {
                        posts.push(postElement);
                      });
                    });

                    //console.log("post count: " + posts.length);
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
                  //console.log("user count: " + users.length)
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

      /*const getOtherUsers = async () => {
        try {
          return await new Promise<User[]>(async (resolve, reject) => {
            const unsubscribe = auth.onAuthStateChanged(async (user) => {
              if (!user) {
                reject(new Error('No user signed in'));
                unsubscribe(); // Stop listening if there's no user
                return;
              }
      
              const usersRef = collection(db, 'users');
              const users: User[] = [];
      
              try {
                const querySnapshot = await getDocs(usersRef);
      
                if (querySnapshot.empty) {
                  reject(new Error('No users found'));
                  return;
                }
      
                for (const doc of querySnapshot.docs) {
                  const userData = doc.data();
      
                  // Get posts from other users
                  const posts: Post[] = await getUserPosts(doc.id);
      
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
                }
      
                console.log("user count: " + users.length);
                resolve(users);
              } catch (error) {
                reject(new Error('Error getting users: ' + error));
              } finally {
                unsubscribe(); // Stop listening after getting the user data
              }
            });
          });
        } catch (error) {
          throw new Error('Unexpected error: ' + error);
        }
      };*/
      

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

            //console.log("post comments count for user: " + userId + "is " + comments.length);

            const post: Post = {
              imageName: postData.imageName,
              imageUrl: postData.imageUrl,
              createdAt: postData.createdAt,
              location: postData.location,
              description: postData.description,
              comments: comments,
            };

            userPosts.push(post);
            
            //console.log("POST: " + post.imageUrl)
          };

          //console.log("user posts count: " + userPosts.length);
          return userPosts;
      };

      /*const getUserPosts = async (userId: string) => {
        try {
          const userPosts: Post[] = [];
          const userPostsCollectionRef = collection(db, `users/${userId}/posts`);
          const userPostsSnapshot = await getDocs(userPostsCollectionRef);
      
          userPostsSnapshot.forEach(async (postDoc) => {
            const postData = postDoc.data();
            
            const promise = getPostComments(userId, postDoc.id)
            .then((commentElements) => {
              return commentElements;
              /*commentElements.forEach((commentElement) => {
                comments.push(commentElement);
              });*/
       /*     });
            const comments = promise.then((commentElements) => {
              const comments: CommentData[] = [];
              commentElements.forEach((commentElement) => {
                comments.push(commentElement);
              });
              return comments;
            })//.finally(() => {

            console.log("comment count: " + (await comments).length);

              const post: Post = {
                imageName: postData.imageName,
                imageUrl: postData.imageUrl,
                createdAt: postData.createdAt,
                location: postData.location,
                description: postData.description,
                comments: await comments,
              };
              userPosts.push(post);
            //});
            console.log("POST: " + post.imageUrl)
          });
          // du må få tak i userPosts:((
          
      
          console.log("user posts count: " + userPosts.length)
          //filter out empty posts, just in case
          const filteredPosts = userPosts.filter((post) => post.imageUrl !== '');
          console.log("filtered posts count: " + filteredPosts.length)
          return filteredPosts;
        } catch (error) {
          console.error('Error getting other user posts:', error);
          return [];
        }
      };*/

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
            console.log("COMMENT: " + comment.text);
          });

          // funksjonen funker
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