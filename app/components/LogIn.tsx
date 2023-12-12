// Sign in component for users to log in to their account
// TODO: refactor, you made this quite early

import { useState } from 'react';
import { Text, View, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { navigate, goBack } from '../routes';
import BackgroundImage from './BackgroundImage';
import IconButton from './IconButton';
import Assets from '../Assets';

export const LogIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
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
            <IconButton Icon={Assets.icons.Back} onPress={() => goBack()} style={styles.backButton} />
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

                <View style={[styles.textField, styles.passwordField]}>
                    <TextInput
                    placeholder='Password'
                    placeholderTextColor={'#9ca3af'}
                    value={password}
                    secureTextEntry={!isPasswordVisible}
                    onChangeText={(password) => setPassword(password)}
                    />
                    <Pressable onPress={() => togglePasswordVisibility()}>
                        <MaterialCommunityIcons name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#451a03" />
                    </Pressable>
                </View>
                
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
    passwordField: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    backButton: {
        position: 'absolute',
        top: 60,
        left: 25,
        zIndex: 1,
    },
});