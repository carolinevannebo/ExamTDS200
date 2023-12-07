import { Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
//import useOwnNavigation from '../hooks/useOwnNavigation';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { navigate } from '../routes/NavigationRef';

export const LogIn: React.FC = () => {
    //const { navigate } = useOwnNavigation();
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
        <View className='container w-max rounded-lg shadow-xl space-y-5 bg-zinc-800 p-6'>
          <Text className='text-xl text-zinc-200'>Log in</Text>
    
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
    
          <TouchableOpacity className='rounded-lg shadow-sm bg-cyan-800 hover:bg-cyan-950 text-white font-bold py-2 px-4 sm:text-sm sm:leading-6'>
            <Button
            onPress={() => onLogin()}
            title='Log in'
            />
          </TouchableOpacity>
    
        </View>
      )
}