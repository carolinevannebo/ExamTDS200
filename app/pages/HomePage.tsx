// User feed page, also known as the home page

import React, { useState, useEffect} from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreatePostModal from './CreatePostModal';
import Assets from '../Assets';

const HomePage: React.FC = () => {
 
    return (
        <SafeAreaView style={styles.container}>
            <CreatePostModal />
            <Text>Home Page</Text>

        </SafeAreaView>
    )
};

export default HomePage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccd5d5',
        alignItems: 'center',
        justifyContent: 'center',
    },
});