// Sign in component for users to log in to their account

import { Text, View, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { navigate, goBack } from '../routes/NavigationRef';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundImage from '../assets/BackgroundImage';
import { Assets } from '../Assets';
import BackButton from '../assets/BackButton';

export const LogIn: React.FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleBack = () => {
        goBack();
    }

    const onLogin = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            console.log('User logged in!');
            navigate('routes/HomeNavigation');
        })
        .catch((error) => {
            console.log('Error logging in: ', error);
        });
    }

    return (
        <BackgroundImage>
            <SafeAreaView style={styles.container}>
                
                <BackButton Icon={Assets.icons.Back} onPress={handleBack} />

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
                
                <Pressable 
                style={styles.button}
                onPress={() => onLogin()}>
                <Text style={styles.text}>
                    Log in
                    </Text>
                </Pressable>
                
                </View>
            </SafeAreaView>
        </BackgroundImage>
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
        shadowColor: '#a16207',
        backgroundColor: 'rgba(255, 237, 213, 0.7)',
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
        color: '#451a03',
        marginBottom: 10,
        width: 240,
    },
    subTitle: {
        fontSize: 16,
        color: '#78350f',
        marginBottom: 20,
    },
    text: {
        color: '#fef3c7',
    },
    textField: {
        borderRadius: 10,
        backgroundColor: '#ffedd5',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        padding: 10,
        width: 240,
        color: '#451a03',
    },
    button: {
        borderRadius: 10,
        shadowRadius: 5,
        shadowColor: '#451a03',
        backgroundColor: '#134e4a',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        margin: 5,
        width: 240,
  },
});