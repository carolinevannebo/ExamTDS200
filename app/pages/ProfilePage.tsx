// User profile page
// TODO: Refaktorer etter klokka 02:00, limit is reached:)))

import React, { useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View, Image, ScrollView, FlatList, RefreshControl, ImageErrorEventData, ImageLoadEventData, ImageComponent, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenTemplate, SettingsModal, ProfilePicture } from '../components';
import { Post, User } from '../models';
import MapView, { Marker } from 'react-native-maps';
import Assets from '../Assets';
import { useUserContext } from '../contexts';
import { navigate } from '../routes';
import { auth } from '../services/firebaseconfig';

interface ProfilePageProps {
    user: User | null;
    getUser?: () => Promise<void>;
}

const ProfilePage: React.FC<ProfilePageProps> = ({user, getUser}) => {
    const { setUserIdForPost, setIdForPost } = useUserContext();
    const [refreshing, setRefreshing] = useState(false);
    const [mapRegion, setMapRegion] = useState({
        latitude: 59.91121,
        longitude: 10.744865,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const handlePress = (item: Post) => {
        setUserIdForPost(user?.uid!);
        setIdForPost(item.imageName);
        navigate("PostDetailPage", {postUserId: user?.uid, postId: item.imageName});
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        if (getUser) {
            await getUser().finally(() => setRefreshing(false));
        }
    }, []);


    const galleryItem = ({ item }: { item: Post }) => {
        Image.prefetch(item.imageUrl)
        .catch((error: ImageErrorEventData) => {
            console.error(error);
            return (
                <View>
                    <Text>Error</Text>
                </View>
            )
        });

        return (
            <View key={item.imageName}>
                <Pressable onPress={() => handlePress(item)}>
                <Image
                source={{ uri: item.imageUrl}} 
                style={{ width: 110, height: 110, marginVertical: 5, borderRadius: 5 }}
                onError={() => {}} />
                </Pressable>
            </View>
        )
    };

    type MyMarkerProps = {
        item: Post;
    };

    const MyMarker: React.FC<MyMarkerProps> = ({ item }) => {
        return (
            <Marker coordinate={{
                latitude: item.location?.latitude!,
                longitude: item.location?.longitude!,
            }}>
                <Image source={{uri: item.imageUrl}} style={{ width: 40, height: 40, borderRadius: 5 }} />
            </Marker>
        )
    }

    const OpenSettings: React.FC = () => {
        if (user?.uid === auth.currentUser?.uid) {
            return <SettingsModal />
        } else return;
    };

    return (
        <ScreenTemplate headerPadding={0}>
        <SafeAreaView style={styles.container}>
            <SettingsModal />
            <ScrollView 
                style={styles.scroll} 
                scrollEnabled={true}
                scrollToOverflowEnabled={true}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>

                <View style={styles.section}>
                    <ProfilePicture size={100} user={user!}/>

                    <View style={styles.headerTextBox}>
                        <Text style={[styles.headerTitle, styles.text]}>{user?.displayName ?? "Username"}</Text>
                        <Text style={styles.text}>{user?.bio !== "" ? user?.bio : "No biography provided"}</Text>
                        
                        <View style={styles.headerInfo}>
                            <View style={styles.headerInfoText}>
                                <Text style={styles.text}>0</Text>
                                <Text style={styles.text}>Posts</Text>
                            </View>

                            <View style={styles.headerInfoText}>
                                <Text style={styles.text}>0</Text>
                                <Text style={styles.text}>Following</Text>
                            </View>

                            <View style={styles.headerInfoText}>
                                <Text style={styles.text}>0</Text>
                                <Text style={styles.text}>Followers</Text>
                            </View>
                        </View>

                    </View>
                </View>

                <View style={styles.mapContainer}>
                    <MapView region={mapRegion} style={styles.map}>
                        {user?.posts.map((_, index) => (
                            <MyMarker key={user?.posts[index].imageName} item={user?.posts[index]} />
                        ))}
                    </MapView>
                </View>

                <View style={[styles.gallery]}>
                    {user?.posts.map((_, index) => (
                        galleryItem({ item: user?.posts[index] })
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
        </ScreenTemplate>
    )
};

export default ProfilePage;

/**<View style={[styles.gallery]}>
                    {posts.map((_, index) => (
                        galleryItem({ item: posts[index] })
                    ))}
                </View> */


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 50,
    },
    scroll: {
        width: '100%',
        height: '100%',
        marginLeft: 15,
    },
    section: {
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: '#819796',
        justifyContent: 'space-around',
        alignItems: 'center',
        margin: 10,
        padding: 20,
        width: '90%',
    },
    headerTextBox: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginLeft: 20,
        width: '60%',
    },
    text: {
        color: '#1d4342',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '500',
    },
    headerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
    },
    headerInfoText: {
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    mapContainer: {
        margin: 10,
        width: '90%',
        height: 200,
    },
    map: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    gallery: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 10,
        margin: 10,
        width: '90%',
    }
});