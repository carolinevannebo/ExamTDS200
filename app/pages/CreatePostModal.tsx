import { useState, useEffect} from 'react';
import {Modal, StyleSheet, Text, Pressable, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { listFiles, uploadImage} from '../services/firebaseconfig';
import { StorageReference } from 'firebase/storage';
import { GeoPoint } from 'firebase/firestore/lite';
import { ModalStateContext, IModalStateContext } from "../contexts/ModalStateContext";
import { useContext } from "react";

const CreatePostModal: React.FC = () => {
    const { isModalVisible, closeModal } = useContext(ModalStateContext) as IModalStateContext;

    const [permission, requestPermission] = ImagePicker.useCameraPermissions();
    const [files, setFiles] = useState<File[]>([]);

    const [location, setLocation] = useState<Location.LocationObject>();
    const [errorMsg, setErrorMsg] = useState<string>();

    // ubrukt atm
    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }
    //

    useEffect(() => {
        (async () => {
      
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }
      
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
          })();

        listFiles()
        .then((response) => {
            const files = response.map((item) => {
                return { name: item.fullPath } as File;
            });
            setFiles(files);
        });
    }, []);

    const checkPermission = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== ImagePicker.PermissionStatus.GRANTED) {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }
    }

    const handleUploadFromGallery = async () => {
        await checkPermission();
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
                base64: true
            });

            if (!result.canceled) {
                await handleUpload(result);
            }
        } catch (error) {
            Alert.alert('Error', (error as Error).message);
        }
    }

    const handleTakePicture = async () => {
        await checkPermission();

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
                base64: true
            });
    
            if (!result.canceled) {
                await handleUpload(result);
            }
        } catch (error) {
            Alert.alert('Error', (error as Error).message);
        }
    };

    const handleUpload = async (result: ImagePicker.ImagePickerResult) => {
        if (!result.canceled) {
            const { uri } = result.assets[0];
            const fileName: string | undefined = uri.split('/').pop() || '';

            const lastKnownLocation = await Location.getLastKnownPositionAsync();
            const location = new GeoPoint(lastKnownLocation?.coords.latitude || 0, lastKnownLocation?.coords.longitude || 0);
            
            const temporaryDescription = 'This is a temporary description';
            await uploadImage(uri, fileName, location, temporaryDescription, (progress: any) => 
                console.log(progress)
            );

            listFiles()
            .then((response) => {
                const files = response.map((item: StorageReference) => {
                    return { name: item.fullPath } as File;
                });

                setFiles(files);
            });
        }
    };

    if (permission?.status !== ImagePicker.PermissionStatus.GRANTED) {
        return (
            <SafeAreaView style={styles.container}>
                <Pressable onPress={() => closeModal()} style={styles.button}>
                    <Text>Hide Modal</Text>
                </Pressable>

                <Text>Permission not granted: {permission?.status}</Text>

                <Pressable onPress={requestPermission}>
                    <Text>Request permission</Text>
                </Pressable>
            </SafeAreaView>
        )
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                closeModal();
            }}
        >
            <SafeAreaView style={styles.container}>
                <Pressable onPress={() => closeModal()} style={styles.button}>
                    <Text>Hide Modal</Text>
                </Pressable>

                <Pressable onPress={handleTakePicture} style={styles.button}>
                    <Text>Take Picture</Text>
                </Pressable>

                <Pressable onPress={handleUploadFromGallery} style={styles.button}>
                    <Text>Upload Image</Text>
                </Pressable>
            </SafeAreaView>
        </Modal>
    )
}

export default CreatePostModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccd5d5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: 50,
    }
});