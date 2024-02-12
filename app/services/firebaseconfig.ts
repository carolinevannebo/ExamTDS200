// Firebase configuration file
// NOTE: Initially used .env files, which worked fine for auth, but not for firestore
// TODO: Investigate why .env files don't work for db and follow up on this
// TODO: Move storage into this file, should not be in UploadService

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

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FB_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FB_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FB_APP_ID,
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

export { app, db, auth };
