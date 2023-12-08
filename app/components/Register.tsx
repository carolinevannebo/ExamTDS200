import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { db, auth } from '../services/firebaseconfig';
import { collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore/lite';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword} from 'firebase/auth';
import { navigate } from '../routes/NavigationRef';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Register: React.FC = () => {
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
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.title}>Create account</Text>

        <TextInput
        style={styles.textField}
        placeholder='Username'
        placeholderTextColor={'#9ca3af'}
        value={userName}
        onChangeText={(userName) => setUserName(userName)}
        />

        <TextInput
        style={styles.textField}
        placeholder='Name'
        placeholderTextColor={'#9ca3af'}
        value={name}
        onChangeText={(name) => setName(name)}
        />

        <TextInput
        style={styles.textField}
        placeholder='Email'
        placeholderTextColor={'#9ca3af'}
        value={email}
        onChangeText={(email) => setEmail(email)}
        />

        <TextInput
        style={styles.textField}
        placeholder='Password'
        placeholderTextColor={'#9ca3af'}
        value={password}
        onChangeText={(password) => setPassword(password)}
        />

        <TextInput
        style={styles.textField}
        placeholder='Repeat Password'
        placeholderTextColor={'#9ca3af'}
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#09090b',
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
