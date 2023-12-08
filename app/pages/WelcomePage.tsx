import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigate } from '../routes/NavigationRef';

const WelcomePage: React.FC = () => {

    const handleSignUp = () => {
        navigate('SignUp');
    };

    const handleLogIn = () => {
        navigate('LogIn');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.subContainer}>
                <Text style={styles.title}>Welcome to Travel Snap!</Text>
                <Text style={styles.subTitle}>Sign up or log in to get started!</Text>

                <TouchableOpacity 
                style={styles.button}
                onPress={handleSignUp}>
                    <Text style={styles.text}>
                    Sign up
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                style={styles.button}
                onPress={handleLogIn}>
                    <Text style={styles.text}>
                    Log in
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default WelcomePage;

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