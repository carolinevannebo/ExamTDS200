import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { db, auth } from '../services/firebaseconfig';
import { collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore/lite';
import { createUserWithEmailAndPassword} from 'firebase/auth';//, getReactNativePersistence } from 'firebase/auth';
//import useOwnNavigation from '../hooks/useOwnNavigation';
import { navigate } from '../routes/NavigationRef';
import { StyleSheet } from 'react-native';


import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import getReactNativePersistence from "@react-native-async-storage/async-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { getReactNativePersistence } from 'firebase/auth';
//import { getReactNativePersistence } from 'firebase/auth/react-native';
//import { initializeAuth, getReactNativePersistence } from "firebase/auth/react-native"

// Your web app's Firebase configuration
/*const firebaseConfig = {
  apiKey: "AIzaSyDi9ybfSnATQ_7TNaDWyaHXhsqhae0-O_Q",
  authDomain: "travel-snap-47abd.firebaseapp.com",
  projectId: "travel-snap-47abd",
  storageBucket: "travel-snap-47abd.appspot.com",
  messagingSenderId: "603110860598",
  appId: "1:603110860598:web:6852d31cf10ce98c017597"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);*/


//auth.setPersistence(getReactNativePersistence(ReactNativeAsyncStorage))
/*auth.setPersistence(persistence)
  .then(() => {
    console.log('Persistence set successfully');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });*/
/*const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})*/

/*const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
  });*/
// tester
/*let persistence = getAsyncStoragePersistence(ReactNativeAsyncStorage);
const auth = initializeAuth(app, {
  persistence: persistence
});*/

export const Register: React.FC = () => {
  //const { navigate } = useOwnNavigation();
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
    const usersCollection = collection(db, 'users');
    const userQuery = query(usersCollection, where('userName', '==', userName));
      getDocs(userQuery)
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          createUserWithEmailAndPassword(auth, email, password)
          .then(() => {
            if (!querySnapshot.empty) {
              return
            }
            
            const currentUserDoc = doc(usersCollection, auth.currentUser?.uid);
            
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

            ReactNativeAsyncStorage.setItem(auth.currentUser?.uid, JSON.stringify({ //endre id til 'userData'?
              name: name,                                      //kan vi stringifie currentUserDoc?
              userName: userName,
              email: email,
              password: password,
              image: 'default',
              bio: '',
              followingCount: 0,
              followersCount: 0,
            }))
            .then(() => {
              console.log('User data stored in AsyncStorage');
              navigate('LogIn');
            })
            .catch((error) => {
              console.error('Error storing user data in AsyncStorage:', error);
            });
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
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.title}>Create account</Text>

        <TextInput
        style={styles.textField}
        placeholder='Username'
        value={userName}
        onChangeText={(userName) => setUserName(userName)}
        />

        <TextInput
        style={styles.textField}
        placeholder='Name'
        value={name}
        onChangeText={(name) => setName(name)}
        />

        <TextInput
        style={styles.textField}
        placeholder='Email'
        value={email}
        onChangeText={(email) => setEmail(email)}
        />

        <TextInput
        style={styles.textField}
        placeholder='Password'
        value={password}
        onChangeText={(password) => setPassword(password)}
        />

        <TextInput
        style={styles.textField}
        placeholder='Repeat Password'
        value={repassword}
        onChangeText={(repassword) => setRepassword(repassword)}
        />

        <TouchableOpacity 
        style={styles.button}
        onPress={() => onRegister()}>
          <Text style={styles.text}>
          Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  subContainer: {
      borderRadius: 10,
      shadowRadius: 10,
      backgroundColor: '#27272a',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
      padding: 40,
      width: 'auto',
      height: 'auto',
  },
  title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#e4e4e7',
      marginBottom: 10,
      width: 240,
  },
  subTitle: {
      fontSize: 16,
      color: '#d4d4d8',
      marginBottom: 20,
  },
  text: {
      color: '#d4d4d8',
  },
  textField: {
      borderRadius: 10,
      shadowRadius: 5,
      shadowColor: '#18181b',
      backgroundColor: '#3f3f46',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
      padding: 10,
      width: 240,
      color: '#e4e4e7',
      placeholderTextColor: '#9ca3af',
  },
  button: {
      borderRadius: 10,
      shadowRadius: 5,
      shadowColor: '#18181b',
      backgroundColor: '#155e75',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      margin: 10,
      width: 240,
      color: '#cffafe',
  },
});
