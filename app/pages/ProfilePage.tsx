// User profile page
// TODO: Refaktorer etter klokka 02:00, limit is reached:)))

import React, { useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View, Image, ScrollView, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserContext } from '../contexts';
import { SettingsModal } from '../components';
import { Post } from '../models';
import MapView, { Marker } from 'react-native-maps';
import Assets from '../Assets';

const ProfilePage: React.FC = () => {
    const { currentUser, currentUserPosts, getCurrentUser, getCurrentUserPosts } = useUserContext();
    //const [user, setUser] = useState<User>();
    //const [posts, setPosts] = useState<Post[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [mapRegion, setMapRegion] = useState({
        latitude: 59.91121,
        longitude: 10.744865,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getCurrentUserPosts().finally(() => setRefreshing(false));
        /*DownloadService.getUserPosts()
            .then((newPosts) => {
                setPosts(newPosts);
                setImageUris(newPosts.map((post) => post.imageUrl));
            })
            .catch((error) => {
                console.error(error.message);
            })
            .finally(() => setRefreshing(false));*/
    }, []);

    useEffect(() => {
        if (currentUser === null) {
            getCurrentUser();
        }

        if (currentUserPosts.length === 0) {
            getCurrentUserPosts();
        }
        /*DownloadService.getUserPosts()
            .then((posts) => {
                setPosts(posts);
                console.log("count: " + posts.length)
                for (let i = 0; i < posts.length; i++) {
                    console.log(posts[i].imageUrl);
                }
                setImageUris(posts.map((post) => post.imageUrl));
            })
            .catch((error) => {
                console.error(error.message);
            });*/
    }, [onRefresh]);

    const postItem = ({ item }: { item: Post }) => {
        return (
            <View key={item.imageName}>
                <Image source={{ uri: item.imageUrl }} style={{ width: 100, height: 100 }} />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <SettingsModal />
            <ScrollView 
                style={styles.scroll} 
                scrollEnabled={true}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>

                <View style={styles.section}>
                    <Image style={styles.profilePicture} source={Assets.images.placeholder.profile} />

                    <View style={styles.headerTextBox}>
                        <Text style={[styles.headerTitle, styles.text]}>{currentUser?.displayName ?? "Set name in settings"}</Text>
                        <Text style={styles.text}>{currentUser?.bio !== "" ? currentUser?.bio : "Write biography"}</Text>
                        
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
                        <Marker coordinate={mapRegion}>
                            <Image source={Assets.images.placeholder.post} style={{ width: 50, height: 50, borderRadius: 5 }} />
                        </Marker>
                    </MapView>
                </View>

                <View style={[styles.section, styles.gallery]}>
                    {currentUserPosts.map((value, index) => (
                        postItem({ item: currentUserPosts[index] })
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    )
};

export default ProfilePage;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccd5d5',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
        height: 'auto',
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    headerTextBox: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginLeft: 20,
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
    }
});