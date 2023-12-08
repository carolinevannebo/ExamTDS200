import { Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { navigate } from '../routes/NavigationRef';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const LogIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            console.log('User logged in!');
            navigate('HomePage');
        })
        .catch((error) => {
            console.log('Error logging in: ', error);
        });
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.title}>Log in</Text>
    
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
    
          <TouchableOpacity 
          style={styles.button}
          onPress={() => onLogin()}>
            <Text style={styles.text}>
            Log in
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