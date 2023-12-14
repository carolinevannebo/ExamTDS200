// Modal for user settings
// TODO: the two modals can be HOC, refactor if you have time

import { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, Pressable, Alert, View, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useModalStateContext, useUserContext } from "../contexts";
import * as ImagePicker from 'expo-image-picker';
import IconButton from './IconButton';
import Assets from '../Assets';
import { auth } from '../services/firebaseconfig';
import LoadingSpinner from './LoadingSpinner';
import UploadService from '../services/UploadService';
import { LinearGradient } from 'expo-linear-gradient';

const SettingsModal: React.FC = () => {
    const { isModalVisible, closeModal } = useModalStateContext();
    const { currentUser, getCurrentUser } = useUserContext();

    const [permission, requestPermission] = ImagePicker.useCameraPermissions();
    const [result, setResult] = useState<ImagePicker.ImagePickerResult | null>(null);

    const [file, setFile] = useState<File>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [profilePicture, setProfilePicture] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");
    const [bio, setBio] = useState<string>("");

    useEffect(() => {
        if (!currentUser) {
            getCurrentUser();
        }

        console.log("profile picture", currentUser?.profilePicture);
        console.log("display name", currentUser?.displayName);
        console.log("bio", currentUser?.bio);


        currentUser?.profilePicture ? setProfilePicture(currentUser?.profilePicture) : () => {};
        currentUser?.displayName ? setDisplayName(currentUser?.displayName) : () => {};
        currentUser?.bio ? setBio(currentUser?.bio) : () => {};
    }, []);

    // TODO: refaktorer funksjoner du bruker flere steder til en egen fil
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

    const signOut = () => {
        closeModal();
        auth.signOut();
    }

    const handleSave = async () => {
        setIsLoading(true);
        console.log("display name", displayName);
        displayName !== "" ? UploadService.uploadDisplayName(displayName) : () => {};
        bio !== "" ? UploadService.uploadBio(bio) : () => {};
        
        if (result && !result!.canceled) {
            const { uri } = result!.assets[0];
            const filename = uri.split('/').pop() || '';

            await UploadService.uploadImage(uri, filename, (progress: any) => console.log(progress))
            .then(() => {
                profilePicture !== currentUser?.profilePicture ? UploadService.uploadProfilePicture() : () => {};
            })
            .catch((error) => {
                Alert.alert('Error', (error as Error).message);
            })
        }
        getCurrentUser();
        setIsLoading(false); 
        closeModal();
    }

    const renderToolbar = () => {
        return (
            <View style={styles.toolbar}>
                <IconButton Icon={() => 
                    <Assets.icons.Logout width={30} height={30} fill="#1d4342"/>
                } onPress={() => (signOut())} style={{marginRight: 10}} />

                <IconButton Icon={() =>
                    <Assets.icons.Close width={30} height={30} fill="#1d4342"/>
                } onPress={() => {closeModal()}} />
            </View>
        )
    }

    const renderImage = () => {
        if (file) { // use new upload if any
            return (
                <Image style={styles.profilePicture} source={{uri: file.name}} />
            )
        } else if (currentUser?.profilePicture !== "default") { // use old upload if any
            return (
                <Image style={styles.profilePicture} source={{uri: currentUser?.profilePicture}} />
            )
        } else { // use placeholder
            return (
                <Image style={styles.profilePicture} source={Assets.images.placeholder.profile} />
            )
        }
    }

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

                    {renderToolbar()}

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
            <Text style={styles.title}>Settings</Text>

            {renderToolbar()}

            <View style={styles.content}>
                <Pressable onPress={handleUploadFromGallery}>
                    {renderImage()}
                </Pressable>

                <TextInput
                style={styles.textField}
                placeholder='Name'
                placeholderTextColor={'#9ca3af'}
                value={displayName}
                onChangeText={(name) => setDisplayName(name)}
                />

                <TextInput
                style={[styles.textField, {height: 100}]}
                placeholder='Write a biography...'
                placeholderTextColor={'#9ca3af'}
                value={bio}
                onChangeText={(bio) => setBio(bio)}
                />

                <Pressable 
                style={styles.button}
                onPress={() => handleSave()}>
                    <Text style={styles.text}>Save</Text>
                </Pressable>
            </View>

            <LoadingSpinner visible={isLoading} close={closeModal} />
            </SafeAreaView>
        </Modal>
    )
}

export default SettingsModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccd5d5',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 30,
    },
    title: {
        color: '#1d4342',
        position: 'absolute',
        fontSize: 23,
        top: 20,
        left: 20,
    },
    toolbar: {
        flexDirection: 'row',
        position: 'absolute',
        top: 20,
        right: 15,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    profilePicture: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
    },
    textField: {
        borderRadius: 10,
        backgroundColor: '#e5eaea',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        padding: 10,
        width: 240,
        color: '#451a03',
    },
    button: {
        borderRadius: 10,
        shadowRadius: 5,
        shadowColor: '#451a03',
        backgroundColor: '#134e4a',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        margin: 5,
        width: 240,
    },
    text: {
        color: '#fef3c7',
    },
});