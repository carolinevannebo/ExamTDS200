// User profile page

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfilePage: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Profile Page</Text>
        </SafeAreaView>
    )
};

export default ProfilePage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccd5d5',
        alignItems: 'center',
        justifyContent: 'center',
    },
});