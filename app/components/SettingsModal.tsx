// Modal for user settings

import { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, Pressable, Alert, View, Image, TextInput, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useModalStateContext } from "../contexts";
import * as ImagePicker from 'expo-image-picker';
import IconButton from './IconButton';
import Assets from '../Assets';
import { auth } from '../services/firebaseconfig';

const SettingsModal: React.FC = () => {
    const { isModalVisible, closeModal } = useModalStateContext();

    const signOut = () => {
        closeModal();
        auth.signOut();
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
            closeModal();
        }}>
            <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <View style={styles.toolbar}>
                <IconButton Icon={() => 
                    <Assets.icons.Logout width={30} height={30} fill="#1d4342"/>
                } onPress={() => (signOut())} style={{marginRight: 10}} />

                <IconButton Icon={() =>
                    <Assets.icons.Close width={30} height={30} fill="#1d4342"/>
                } onPress={() => {closeModal()}} />
            </View>

            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccd5d5',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 30
    },
    title: {
        color: '#1d4342',
        position: 'absolute',
        fontSize: 30,
        top: 20,
        left: 20,
    },
    toolbar: {
        flexDirection: 'row',
        position: 'absolute',
        top: 20,
        right: 15,
    },
});

export default SettingsModal;