import React from 'react';
import { View, Text } from 'react-native';

const HomePage: React.FC = () => {
    return (
        <View className='container w-max rounded-lg shadow-xl space-y-5 bg-zinc-800 p-6'>
            <Text className='text-xl text-zinc-200'>Home Page</Text>
        </View>
    )
};

export default HomePage;