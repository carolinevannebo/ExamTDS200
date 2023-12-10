// Firebase configuration file

import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, listAll } from 'firebase/storage';
import { getFirestore, initializeFirestore, collection, doc, setDoc, serverTimestamp, GeoPoint } from 'firebase/firestore/lite';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../routes/NavigationRef';
import { 
  Auth, 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence, 
  onAuthStateChanged
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

const uploadImage = async (
  uri: string, 
  imageName: string, 
  location: GeoPoint | undefined, 
  description: string, 
  onProgress: any ) => { // todo: finn type til any
    
  const user = auth.currentUser;
  console.log('userID', user?.uid);

  const alteredImageName = imageName.slice(0, imageName.lastIndexOf('.'));

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
        const currentImageDoc = doc(userImagesCollection, alteredImageName);
        const imageMetadata = {
          imageName: imageName,
          imageUrl: downloadUrl,
          createdAt: serverTimestamp(),
          location: location,
          description: description,
        };
        console.log('imageMetadata', imageMetadata);

        setDoc(currentImageDoc, imageMetadata);

        ReactNativeAsyncStorage.setItem(`${auth.currentUser?.uid}/posts`, JSON.stringify(imageMetadata))
        .then(() => {
          console.log('Image metadata stored in AsyncStorage');
        })
        .catch((error) => {
          console.error('Error storing user data in AsyncStorage:', error);
        });

        console.log('Upload is complete!');
      },
    );
  })
};

const listFiles = async () => {
  const user = auth.currentUser;
  const listRef = ref(getStorage(), `images/${user?.uid}`);
  const response = await listAll(listRef);

  return response.items;
};

export { app, db, auth, uploadImage, listFiles };