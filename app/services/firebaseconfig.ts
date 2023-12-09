// Firebase configuration file

import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, listAll } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore/lite';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Auth, 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence, 
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
  appId: process.env.FB_APP_ID,
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
    return null;
  }
});

const uploadImage = async (uri: string, imageName: string, onProgress: any ) => { // todo: finn type til any
  const response = await fetch(uri);
  const blob = await response.blob();

  const imageRef = ref(getStorage(), `images/${imageName}`);
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
        resolve({ 
          downloadUrl, 
          metadata: uploadTask.snapshot.metadata 
        });

        console.log('Upload is complete!');
      },
    );
  })
};

const listFiles = async () => {
  const listRef = ref(getStorage(), 'images');
  const response = await listAll(listRef);

  return response.items;
};

export { app, db, auth, uploadImage, listFiles };