// User profile page

import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Image, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUser, getUserPosts } from '../services/firebaseconfig';
import { User } from '../models/User';
import { Post } from '../models/Post';
import MapView, { Marker } from 'react-native-maps';

const ProfilePage: React.FC = () => {
    const placeholderProfileSrc = require('../assets/images/placeholder-profile.jpeg');
    const placeholderPostSrc = require('../assets/images/test-upload.jpg');

    const [user, setUser] = useState<User>();
    const [posts, setPosts] = useState<Post[]>([]);
    //const [imageUris, setImageUris] = useState<string[]>([]);
    const [mapRegion, setMapRegion] = useState({
        latitude: 59.91121,
        longitude: 10.744865,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        //loadProfileData();
    }, [posts]);

    const loadProfileData = async () => {
        await getCurrentUser()
          .then((user) => {
            setUser(user);
            console.log(user);

            getUserPosts()
                .then((posts) => {
                    const clearedPosts = posts.filter((post) => 
                    post.imageName !== '')
                    .map((post) => post);
                    setPosts(clearedPosts);
                    //setImageUris(clearedPosts.map((post) => post.imageUrl));
                })
                .catch((error) => {
                    throw error;
                });
          })
          .catch((error) => {
            console.error(error.message);
          });
    }

    return (
        <SafeAreaView style={styles.container}>

                <View style={styles.section}>
                    <Image style={styles.profilePicture} source={placeholderProfileSrc} />

                    <View style={styles.headerTextBox}>
                        <Text style={[styles.headerTitle, styles.text]}>{user?.displayName ?? "Set name in settings"}</Text>
                        <Text style={styles.text}>{user?.bio !== "" ? user?.bio : "Write biography"}</Text>
                        
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

                <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

                <View style={styles.mapContainer}>
                    <MapView region={mapRegion} style={styles.map}>
                        <Marker coordinate={mapRegion}>
                            <Image source={placeholderPostSrc} style={{ width: 50, height: 50, borderRadius: 5 }} />
                        </Marker>
                    </MapView>
                </View>

                <View style={[styles.section, styles.gallery]}>
                    {posts.map((post) => {
                        return (
                            <View key={post.imageName}>
                                <Image source={{ uri: post.imageUrl }} style={{ width: 100, height: 100 }} />
                            </View>
                        )
                    })}
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
        flex: 1,
        width: '100%',
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