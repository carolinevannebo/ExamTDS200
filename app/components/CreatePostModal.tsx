// Modal for creating a post
// TODO: refactor, error alerts

import { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, Pressable, Alert, View, Image, TextInput, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GeoPoint } from 'firebase/firestore/lite';
import { useModalStateContext } from "../contexts";
import UploadService from '../services/UploadService';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import LoadingSpinner from './LoadingSpinner';
import IconButton from './IconButton';
import Assets from '../Assets';

const CreatePostModal: React.FC = () => {
    const { isModalVisible, closeModal } = useModalStateContext();

    const [permission, requestPermission] = ImagePicker.useCameraPermissions();
    const [result, setResult] = useState<ImagePicker.ImagePickerResult | null>(null);

    const [file, setFile] = useState<File>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [location, setLocation] = useState<Location.LocationObject>();
    const [errorMsg, setErrorMsg] = useState<string>();

    const [imageDescription, setImageDescription] = useState("");

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
    }, [file]);

    const checkPermission = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== ImagePicker.PermissionStatus.GRANTED) {
            Alert.alert('Sorry, we need camera roll permissions to make this work!');
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
                const file = new File([result.assets[0].uri], result.assets[0].uri);
                setFile(file);
                setResult(result);
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
                const file = new File([result.assets[0].uri], result.assets[0].uri);
                setFile(file);
                setResult(result);
            }
        } catch (error) {
            Alert.alert('Error', (error as Error).message);
        }
    };

    const handleUpload = async (result: ImagePicker.ImagePickerResult) => {
        if (!result.canceled) {
            setIsLoading(true)

            const { uri } = result.assets[0];
            const fileName: string = uri.split('/').pop() || '';

            const lastKnownLocation = await Location.getLastKnownPositionAsync();
            const location = new GeoPoint(lastKnownLocation?.coords.latitude || 0, lastKnownLocation?.coords.longitude || 0);
            
            await UploadService.uploadImage(uri, fileName, (progress: any) => 
                console.log(progress), location
            ).then(() => {
                UploadService.uploadPost(imageDescription);
                // check if successful:
                // ?
                // then:
                setIsLoading(false);
                setFile(undefined);
                // finally:
                closeModal();
            }).catch((error) => {
                console.log(error);
            });
        }
    };

    if (permission?.status !== ImagePicker.PermissionStatus.GRANTED) {
        return (
            <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                closeModal();
            }}>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.title}>Share experience</Text>

                    <IconButton Icon={() =>
                        <Assets.icons.Close width={30} height={30} fill="#1d4342"/>
                    } onPress={() => {closeModal()}} style={styles.closeButton} />

                    <View style={{marginTop: 350}}>
                        <Text>Permission not granted: {permission?.status}</Text>

                        <Pressable onPress={requestPermission}>
                            <Text>Request permission</Text>
                        </Pressable>
                    </View>
                </SafeAreaView>
            </Modal>
        )
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
                <Text style={styles.title}>Share experience</Text>
                <IconButton Icon={() =>
                    <Assets.icons.Close width={30} height={30} fill="#1d4342"/>
                } onPress={() => {closeModal()}} style={styles.closeButton} />

                { file ? (
                    <View style={styles.content}>
                    <Image source={{ uri: file.name }} style={styles.image} />  
                    <TextInput
                    style={styles.textField}
                    placeholder='Write a description...'
                    placeholderTextColor={'#9ca3af'}
                    multiline={true}
                    value={imageDescription}
                    onResponderEnd={() => Keyboard.dismiss()}
                    onChangeText={((text) => setImageDescription(text))}
                    />
                    </View>
                    ) : ( 
                        <View style={{marginTop: 350}}>
                            <Text>No image uploaded</Text>
                        </View>
                    )
                }

                <View style={styles.leftToolBar}>
                    <IconButton Icon={() =>
                        <Assets.icons.Camera width={35} height={35} fill="#fff"/>
                    } onPress={handleTakePicture} />

                    <IconButton Icon={() =>
                        <Assets.icons.Image width={35} height={35} fill="#fff"/>
                    } onPress={handleUploadFromGallery} />
                </View>

                <View style={styles.rightToolBar}>
                    <Pressable onPress={() => handleUpload(result!)}>
                        <Text style={{color: '#fff', fontSize: 18}}>Share</Text>
                    </Pressable>
                </View>

                <LoadingSpinner visible={isLoading} close={closeModal} />

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
        justifyContent: 'flex-start',
        marginTop: 30
    },
    title: {
        color: '#1d4342',
        position: 'absolute',
        fontSize: 23,
        top: 20,
        left: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 15,
    },
    content: {
        borderRadius: 10,
        backgroundColor: '#b3c0c0',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 65,
        padding: 20,
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 10,
    },
    textField: {
        width: 300,
        height: 80,
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: '#e5eaea',
        textAlignVertical: 'top',
    },
    leftToolBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 70,
        width: '58%',
        borderTopRightRadius: 20,
        backgroundColor: '#4f6d6c',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    rightToolBar: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: 70,
        width: '40%',
        borderTopLeftRadius: 20,
        backgroundColor: '#365857',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }
});