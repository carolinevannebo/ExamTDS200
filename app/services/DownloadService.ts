import { Post } from "../models/Post";
import { auth, db } from "./firebaseconfig";
import { 
    doc,
    collection,
    getDocs,
    getDoc
} from "firebase/firestore/lite";
import { User } from "../models/User";

const DownloadService = (() => {

    const getCurrentUser = () => {
        return new Promise<User>((resolve, reject) => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
              const userDocRef = doc(db, 'users', user.uid);

              getDoc(userDocRef)
                .then((querySnapshot) => {
                  if (querySnapshot.exists()) {

                    const userData = querySnapshot.data();
                    const user: User = {
                      uid: auth.currentUser?.uid,
                      bio: userData.bio,
                      email: userData.email,
                      followers: userData.followersCount,
                      following: userData.followingCount,
                      profilePicture: userData.image,
                      displayName: userData.name,
                      userName: userData.userName,
                      posts: userData.posts,
                    };
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
                    const promise = getOtherUserPosts(doc.id).then((postElements) => {
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
                  console.log("user count: " + users.length)
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

      const getUserPosts = async () => {
        try {
            // Get posts from other users
            const userPosts: Post[] = [];
      
            const userPostsCollectionRef = collection(db, `users/${auth.currentUser?.uid}/posts`);
            const userPostsSnapshot = await getDocs(userPostsCollectionRef);
      
            userPostsSnapshot.forEach((postDoc) => {
              const post = postDoc.data() as Post;
              userPosts.push(post);
            });
      
            //filter out empty posts, just in case
            const filteredPosts = userPosts.filter((post) => post.imageUrl !== '');
            return filteredPosts;
        } catch (error) {
          console.error('Error getting user posts:', error);
          throw error;
        }
      };

    /*const getUserPosts = () => {
        return new Promise<Post[]>((resolve, reject) => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
              const userDocRef = doc(db, 'users', user.uid);
              const postsCollectionRef = collection(userDocRef, 'posts');
      
              getDocs(postsCollectionRef)
                .then((querySnapshot) => {
                  const posts: Post[] = [];
                  querySnapshot.forEach((doc) => {
                    posts.push(doc.data() as Post);
                  });
      
                  //filter out empty posts, just in case
                  const filteredPosts = posts.filter((post) => post.imageUrl !== '');
      
                  resolve(filteredPosts);
                })
                .catch((error) => {
                  reject(new Error('Error getting user posts: ' + error));
                });
            } else {
              reject(new Error('No user signed in'));
              unsubscribe(); // Stop listening if there's no user
            }
          });
        });
      };*/

      const getOtherUserPosts = async (userId: string) => {
        try {
          const userPosts: Post[] = [];
          const userPostsCollectionRef = collection(db, `users/${userId}/posts`);
          const userPostsSnapshot = await getDocs(userPostsCollectionRef);
      
          userPostsSnapshot.forEach((postDoc) => {
            const postData = postDoc.data();
            const post: Post = {
              imageName: postData.imageName,
              imageUrl: postData.imageUrl,
              createdAt: postData.createdAt,
              location: postData.location,
              description: postData.description,
            };
            userPosts.push(post);
          });
      
          //filter out empty posts, just in case
          const filteredPosts = userPosts.filter((post) => post.imageUrl !== '');
          return filteredPosts;
        } catch (error) {
          console.error('Error getting other user posts:', error);
          return [];
        }
      };

      const getFeedPosts = async () => {
        try {
          // Get posts from other users
          const postsSnapshot = await getDocs(collection(db, 'users'));
          const otherUsersPosts: Post[] = [];
      
          for (const userDoc of postsSnapshot.docs) {
            const userId = userDoc.id;
            // Skip the current user's posts
            if (userId === auth.currentUser?.uid) {
              continue;
            }
      
            const userPostsCollectionRef = collection(db, `users/${userId}/posts`);
            const userPostsSnapshot = await getDocs(userPostsCollectionRef);
      
            userPostsSnapshot.forEach((postDoc) => {
              const post = postDoc.data() as Post;
              otherUsersPosts.push(post);
            });
          }
      
          //filter out empty posts, just in case
          const filteredPosts = otherUsersPosts.filter((post) => post.imageUrl !== '');
          return filteredPosts;
        } catch (error) {
          console.error('Error getting feed posts:', error);
          throw error;
        }
      };

      return {
        getCurrentUser,
        getOtherUsers,
        getUserPosts,
        getFeedPosts,
      };
})();

export default DownloadService;