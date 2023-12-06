import { Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import {initializeApp} from 'firebase/app';
import { getFirestore, collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore/lite';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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
    <View className='rounded-lg shadow-xl space-y-5 bg-zinc-800 p-6'>
      <Text className='text-xl text-zinc-200'>Register</Text>

      <TextInput
      className='rounded-lg shadow-sm ring-1 ring-inset ring-zinc-700 py-1.5 pl-2 text-zinc-200 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-zinc-700'
      placeholder='Username'
      value={userName}
      onChangeText={(userName) => setUserName(userName)}
      />

      <TextInput
      className='rounded-lg shadow-sm ring-1 ring-inset ring-zinc-700 py-1.5 pl-2 text-zinc-200 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-zinc-700'
      placeholder='Name'
      value={name}
      onChangeText={(name) => setName(name)}
      />

      <TextInput
      className='rounded-lg shadow-sm ring-1 ring-inset ring-zinc-700 py-1.5 pl-2 text-zinc-200 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-zinc-700'
      placeholder='Email'
      value={email}
      onChangeText={(email) => setEmail(email)}
      />

      <TextInput
      className='rounded-lg shadow-sm ring-1 ring-inset ring-zinc-700 py-1.5 pl-2 text-zinc-200 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-zinc-700'
      placeholder='Password'
      value={password}
      onChangeText={(password) => setPassword(password)}
      />

      <TextInput
      className='rounded-lg shadow-sm ring-1 ring-inset ring-zinc-700 py-1.5 pl-2 text-zinc-200 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-zinc-700'
      placeholder='Repeat Password'
      value={repassword}
      onChangeText={(repassword) => setRepassword(repassword)}
      />

      <TouchableOpacity
      className='rounded-lg shadow-sm bg-cyan-800 hover:bg-cyan-950 text-white font-bold py-2 px-4 sm:text-sm sm:leading-6'
      >
        <Button
        onPress={() => onRegister()}
        title='Register'
        />
      </TouchableOpacity>

    </View>
  )
}