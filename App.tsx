import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// firebase imports + register
import {initializeApp} from 'firebase/app';
import { getFirestore, collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';
//import firebase from 'firebase/compat/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { TextInput, Button } from 'react-native';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi9ybfSnATQ_7TNaDWyaHXhsqhae0-O_Q",
  authDomain: "travel-snap-47abd.firebaseapp.com",
  projectId: "travel-snap-47abd",
  storageBucket: "travel-snap-47abd.appspot.com",
  messagingSenderId: "603110860598",
  appId: "1:603110860598:web:6852d31cf10ce98c017597"
};

const app = initializeApp(firebaseConfig);
const defaultFirestore = getFirestore(app);
const defaultStorage = getStorage(app);
const auth = getAuth(app);


interface RegisterProps {
  navigation: any;
}

export const Register: React.FC<RegisterProps> = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [isValid, setIsValid] = useState({
    bool: true,
    boolSnack: true,
    message: 'Please fill out all fields'
  });

  const validateField = (field: string) => {
    if (field === '') {
      setIsValid({
        bool: false,
        boolSnack: true,
        message: 'Please fill out all fields'
      });
    }
  }

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setIsValid({
        bool: false,
        boolSnack: true,
        message: 'Password must be at least 6 characters'
      });
    }
    if (password !== repassword) {
      setIsValid({
        bool: false,
        boolSnack: true,
        message: 'Passwords do not match'
      });
    }
  }

  const onRegister = () => {
    validateField(email);
    validateField(password);
    validateField(repassword);
    validateField(name);
    validateField(userName);
    validatePassword(password);

    if (isValid.bool) {
    const usersCollection = collection(defaultFirestore, 'users');
    const userQuery = query(usersCollection, where('userName', '==', userName));
      /*firebase
      .firestore()
      .collection('users')
      .where('userName', '==', userName)
      .get()*/
      getDocs(userQuery)
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          createUserWithEmailAndPassword(auth, email, password)
          .then(() => {
            if (!querySnapshot.empty) {
              return
            }

            const currentUserDoc = doc(usersCollection, auth.currentUser?.uid);
            /*firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser?.uid) // possibly null*/
            setDoc(currentUserDoc, {
              name: name,
              userName: userName,
              email: email,
              password: password,
              image: 'default',
              bio: '',
              followingCount: 0,
              followersCount: 0,
            });
            console.log('User account created!');
          })
          .catch((error) => {
            console.log(error);
            setIsValid({
              bool: false,
              boolSnack: true,
              message: error.message
            });
          });
        };
      })
      .catch((error) => {
        console.log(error);
        setIsValid({
          bool: false,
          boolSnack: true,
          message: error.message
        });
      });
    };
  };

  return (
    <View>
      <Text>Register</Text>

      <TextInput
      placeholder='Username'
      value={userName}
      onChangeText={(userName) => setUserName(userName)}
      />

      <TextInput
      placeholder='Name'
      value={name}
      onChangeText={(name) => setName(name)}
      />

      <TextInput
      placeholder='Email'
      value={email}
      onChangeText={(email) => setEmail(email)}
      />

      <TextInput
      placeholder='Password'
      value={password}
      onChangeText={(password) => setPassword(password)}
      />

      <TextInput
      placeholder='Repeat Password'
      value={repassword}
      onChangeText={(repassword) => setRepassword(repassword)}
      />

      <Button
      onPress={() => onRegister()}
      title='Register'
      />

    </View>
  )
}

export default function App() {
  return (
    <View style={styles.container}>
      <Register navigation={undefined}></Register>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
