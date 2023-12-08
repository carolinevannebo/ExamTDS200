// Firebase configuration file

import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
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

export { app, db, auth };