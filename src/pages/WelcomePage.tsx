import React from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
//import useOwnNavigation from '../hooks/useOwnNavigation';
import { navigate } from '../routes/NavigationRef';

const WelcomePage: React.FC = () => {
    //const { navigate } = useOwnNavigation();

    const handleSignUp = () => {
        navigate('SignUp');
    };

    const handleLogIn = () => {
        navigate('LogIn');
    };

    return (
        <View className='container w-max rounded-lg shadow-xl space-y-5 bg-zinc-800 p-6'>
            <Text className='text-xl text-zinc-200'>Welcome to Travel Snap!</Text>
            <Text className='text-l text-zinc-300'>Sign up or log in to get started!</Text>

            <TouchableOpacity className='rounded-lg shadow-sm bg-cyan-800 hover:bg-cyan-950 text-white font-bold py-2 px-4 sm:text-sm sm:leading-6'>
                <Button
                onPress={handleSignUp}
                title='Sign up'
                />
            </TouchableOpacity>

            <TouchableOpacity className='rounded-lg shadow-sm bg-cyan-800 hover:bg-cyan-950 text-white font-bold py-2 px-4 sm:text-sm sm:leading-6'>
                <Button
                onPress={handleLogIn}
                title='Log in'
                />
            </TouchableOpacity>
        </View>
    );
};

export default WelcomePage;