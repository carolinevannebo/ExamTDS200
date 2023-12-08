import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Stack } from 'expo-router'

const HomePage: React.FC = () => {
    return (
        <SafeAreaView>
            <Text>Home Page</Text>
        </SafeAreaView>
    )
};

export default HomePage;