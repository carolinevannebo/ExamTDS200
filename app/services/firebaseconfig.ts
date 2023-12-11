// Firebase configuration file

import { User } from '../models/User';
import { Post } from '../models/Post';
import { Platform } from 'react-native';
import { navigate } from '../routes/NavigationRef';
import { initializeApp } from 'firebase/app';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, listAll } from 'firebase/storage';
import { 
  doc,
  getDoc,
  setDoc,
  GeoPoint,
  collection,
  DocumentData,
  getFirestore,
  serverTimestamp, 
  DocumentReference,
  getDocs
} from 'firebase/firestore/lite';
import { 
  Auth, 
  getAuth, 
  initializeAuth, 
  onAuthStateChanged,
  getReactNativePersistence
} from 'firebase/auth';

// for some reason firestore lite doesn't read env variables, my mistake somewhere?
/*const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FB_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FB_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FB_APP_ID,
};*/

const firebaseConfig = {
  apiKey: "AIzaSyDi9ybfSnATQ_7TNaDWyaHXhsqhae0-O_Q",
  authDomain: "travel-snap-47abd.firebaseapp.com",
  projectId: "travel-snap-47abd",
  storageBucket: "travel-snap-47abd.appspot.com",
  messagingSenderId: "603110860598",
  appId: "1:603110860598:web:6852d31cf10ce98c017597"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let auth: Auth;

// Authentication must be initialized based on the platform
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log('User is signed in', uid);
    return user;
  } else {
    console.log('User is signed out');
    navigate('pages/WelcomePage');
  }
});

const getCurrentUser = () => {
  return new Promise<User>((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        getDoc(userDocRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data() as User;
              resolve(userData);
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

const getUserPosts = () => {
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
            resolve(posts);
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
}

const getFeedPosts = async () => {
  try {
    const currentUser = await getCurrentUser();
    
    // Get posts from other users
    const postsSnapshot = await getDocs(collection(db, 'users'));
    const otherUsersPosts: Post[] = [];

    for (const userDoc of postsSnapshot.docs) {
      const userId = userDoc.id;
      
      // Skip the current user's posts
      if (userId === currentUser.uid) {
        continue;
      }

      const userPostsCollectionRef = collection(db, `users/${userId}/posts`);
      const userPostsSnapshot = await getDocs(userPostsCollectionRef);

      userPostsSnapshot.forEach((postDoc) => {
        const post = postDoc.data() as Post;
        otherUsersPosts.push(post);
      });
    }

    // Sort posts by createdAt timestamp in descending order
    //const sortedPosts = otherUsersPosts.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    // Take the last 20 posts
    //const last20Posts = sortedPosts.slice(0, 20);

    return otherUsersPosts;
  } catch (error) {
    console.error('Error getting feed posts:', error);
    throw error;
  }
}

const getImageName = (fileName: string) => {
  return fileName.slice(0, fileName.lastIndexOf('.'));
}

const uploadImage = async (
  uri: string, 
  imageName: string, 
  location: GeoPoint | undefined, 
  description: string, 
  onProgress: any ) => { // todo: finn type til any
    
  const user = auth.currentUser;
  console.log('userID', user?.uid);

  //const alteredImageName = imageName.slice(0, imageName.lastIndexOf('.'));

  if (!user) {
    throw new Error('No user signed in');
  }

  const response = await fetch(uri);
  const blob = await response.blob();

  const imageRef = ref(getStorage(), `images/${user.uid}/${imageName}`);
  const uploadTask = uploadBytesResumable(imageRef, blob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        onProgress && onProgress(progress);
        console.log(`Upload is ${progress}% done`);

      },
      (error) => {
        console.log(error);
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

        // Finally, resolve the promise with the download URL
        resolve({ 
          downloadUrl, 
          metadata: uploadTask.snapshot.metadata,
        });

        // Add image to user, sending to firestore
        const userImagesCollection = collection(db, `users/${auth.currentUser?.uid}/posts`);
        const postDocRef = doc(userImagesCollection, getImageName(imageName));

        const post: Post = {
          imageName: imageName,
          imageUrl: downloadUrl,
          createdAt: serverTimestamp(),
          location: location,
          description: description,
        };
        console.log('post', post);

        uploadPost(postDocRef, post);
      }
    );
  })
};

const uploadPost = async (docRef: DocumentReference<DocumentData, DocumentData>, post: Post) => {
  setDoc(docRef, post);

  ReactNativeAsyncStorage.setItem(`${auth.currentUser?.uid}/posts`, JSON.stringify(post))
  .then(() => {
    console.log('Post stored in AsyncStorage');
  })
  .catch((error) => {
    console.error('Error storing user data in AsyncStorage:', error);
  });

  console.log('Upload is complete!');
}

const listFiles = async () => {
  const user = auth.currentUser;
  const listRef = ref(getStorage(), `images/${user?.uid}`);
  const response = await listAll(listRef);

  return response.items;
};

export { app, db, auth, uploadImage, getCurrentUser, getUserPosts, getFeedPosts };