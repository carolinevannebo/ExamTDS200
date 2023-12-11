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

export { app, db, auth };