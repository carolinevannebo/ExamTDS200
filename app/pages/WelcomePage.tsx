// Welcome page for first time users

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigate } from '../routes/NavigationRef';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import BackgroundImage from '../assets/BackgroundImage';

const WelcomePage: React.FC = () => {

    const handleSignUp = () => {
        navigate('components/Register');
    };

    const handleLogIn = () => {
        navigate('components/LogIn');
    };

    return (
        <BackgroundImage>
        <SafeAreaView style={styles.container}>
            <View style={styles.subContainer}>
                <Text style={styles.title}>Welcome to Travel Snap!</Text>
                <Text style={styles.subTitle}>Sign up or log in to get started!</Text>

                <Pressable 
                style={styles.button}
                onPress={handleSignUp}>
                    <Text style={styles.text}>
                    Sign up
                    </Text>
                </Pressable>

                <Pressable 
                style={styles.button}
                onPress={handleLogIn}>
                    <Text style={styles.text}>
                    Log in
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
        </BackgroundImage>
    );
};

export default WelcomePage;

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