import { IconButton, ScreenTemplate, ProfilePicture, CommentSection } from "../components";
import { Text, StyleSheet, Image, View, ScrollView, Pressable } from "react-native";
import { useUserContext } from "../contexts";
import React, { useEffect, useState } from "react";
import { CommentData, Post, User } from "../models";
import Assets from "../Assets";
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from "expo-linear-gradient";
import { Timestamp } from "firebase/firestore/lite";
import { navigate } from "../routes";

type PostDetailPageProps = {
    postUserId: string;
    postId: string;
}

const PostDetailPage: React.FC<PostDetailPageProps> = ({postUserId, postId}) => {
    const { getUserPost, getUserById, currentUser, setOtherUser } = useUserContext();
    const [post, setPost] = useState<Post | undefined>(undefined);
    const [user, setUser] = useState<User | undefined>(undefined);
    const [comments, setComments] = useState<CommentData[]>([]);
    const [mapRegion, setMapRegion] = useState({
        latitude: 59.91121,
        longitude: 10.744865,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        getUserPost(postUserId, postId)
        .then((post) => {
            setPost(post);
            setComments(post?.comments || []);

            setMapRegion({
                latitude: post?.location?.latitude!,
                longitude: post?.location?.longitude!,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        })
        .catch((error) => {
            console.error(error);
        });

        getUserById(postUserId)
        .then((user) => {
            setUser(user);
        }).catch((error) => {
            console.error(error);
        });
    }, []);
    
    const handleNavigate = () => {
        setOtherUser(user!); // nå krongler du litt
        navigate("ProfilePage");
    }

    const testComments: CommentData[] = [
        {
            author: currentUser!,
            text: "This is a comment",
            date: Timestamp.fromDate(new Date(Date.now())),
        },
        {
            author: user!,
            text: "This is another comment",
            date: Timestamp.fromDate(new Date(Date.now())),
        }
    ];

    return (
        <ScreenTemplate headerPadding={50}>
            <ScrollView
            overScrollMode="auto"
            contentContainerStyle={styles.container}>

            <View style={styles.postContainer}>

                <LinearGradient 
                colors={['#365857', '#688281']}
                start={{x: 0, y: 0}} end={{x: 0.8, y: 0}}
                style={styles.header}>
                <Pressable onPress={handleNavigate}>
                        <ProfilePicture size={50} user={user!} style={styles.profilePicture} />
                    </Pressable>

                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{user?.displayName}</Text>
                            <Text style={styles.subTitle}>{user?.userName}</Text>
                        </View>
                </LinearGradient>

                <Image source={{uri: post?.imageUrl}} style={styles.image} />

                <View style={styles.infoContainer}>
                    <View style={styles.info}>
                        <Text>{post?.description}</Text>
                        <IconButton 
                            Icon={() => <Assets.icons.Heart width={25} height={25} fill="#042f2e"/>} 
                            onPress={() => {}} />
                    </View>

                    <View style={styles.comments}>
                        <CommentSection 
                        comments={comments} 
                        currentUser={currentUser!}
                        postUserId={postUserId}
                        postId={postId} />
                    </View>
                </View>

            </View>

            <View style={styles.mapContainer}>
                    <MapView region={mapRegion} style={styles.map}>
                        <Marker coordinate={mapRegion}/>
                    </MapView>
                </View>

            </ScrollView>
        </ScreenTemplate>
    )
};

export default PostDetailPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginHorizontal: 10,
        marginTop: 50,
    },
    postContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginBottom: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: "100%",
    },
    profilePicture: {
        margin: 10,
    },
    titleContainer: {
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "500",
        color: '#042f2e',
    },
    subTitle: {
        fontSize: 15,
        fontWeight: "400",
        color: '#042f2e',
    },
    image: {
        width: 370, 
        height: 370, 
        resizeMode: "contain",
    },
    infoContainer: {
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "rgba(154, 171, 171, 0.8)",
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        width: "100%",
        padding: 10,
    },
    info: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", 
        width: "100%",
    },
    comments: {
        marginTop: 10,
        width: "100%",
    },
    mapContainer: {
        width: '100%',
        height: 150,
        marginBottom: 10,
    },
    map: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
});