// User feed page, also known as the home page

import React, { useState, useEffect} from 'react';
import { Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { listFiles, uploadImage, db, auth } from '../services/firebaseconfig';
import { FullMetadata, StorageReference } from 'firebase/storage';
import { collection, doc, setDoc } from 'firebase/firestore/lite';

const HomePage: React.FC = () => {
    const [permission, requestPermission] = ImagePicker.useCameraPermissions();
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        listFiles()
            .then((response) => {
                const files = response.map((item) => {
                    return { name: item.fullPath } as File;
                });

                setFiles(files);
            });
    }, []);

    const handleTakePicture = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== ImagePicker.PermissionStatus.GRANTED) {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
                base64: true
            });
    
            if (!result.canceled) {
                //console.log(result.assets[0].uri);

                const { uri } = result.assets[0];
                const fileName: string | undefined = uri.split('/').pop() || '';

                const response = await uploadImage(uri, fileName, (progress: any) => 
                    console.log(progress)
                );

                console.log("response: ", response);

                listFiles()
                    .then((response) => {
                        const files = response.map((item: StorageReference) => {
                            return { name: item.fullPath } as File;
                        });

                        setFiles(files);
                    });
            }
        } catch (error) {
            Alert.alert('Error', (error as Error).message);
        }
    };

    if (permission?.status !== ImagePicker.PermissionStatus.GRANTED) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Permission not granted: {permission?.status}</Text>

                <Pressable onPress={requestPermission}>
                    <Text>Request permission</Text>
                </Pressable>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text>Home Page</Text>

            <Pressable onPress={handleTakePicture}>
                <Text>Take Picture</Text>
            </Pressable>
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