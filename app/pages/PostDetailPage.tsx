import { IconButton, ScreenTemplate, ProfilePicture } from "../components";
import { Text, StyleSheet, Image, View, ScrollView } from "react-native";
import { useUserContext } from "../contexts";
import { useEffect, useState } from "react";
import { Post, User } from "../models";
import Assets from "../Assets";
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from "expo-linear-gradient";

type PostDetailPageProps = {
    postUserId: string;
    postId: string;
}

const PostDetailPage: React.FC<PostDetailPageProps> = ({postUserId, postId}) => {
    const { getUserPost, getUserById } = useUserContext();
    const [post, setPost] = useState<Post | undefined>(undefined);
    const [user, setUser] = useState<User | undefined>(undefined);
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

    return (
        <ScreenTemplate headerPadding={50}>
            <ScrollView
            contentContainerStyle={styles.container}>

            <View style={styles.postContainer}>

                <LinearGradient 
                colors={['#365857', '#688281']}
                start={{x: 0, y: 0}} end={{x: 0.8, y: 0}}
                style={styles.header}>
                    <ProfilePicture size={50} user={user!} style={styles.profilePicture} />

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{user?.displayName}</Text>
                        <Text style={styles.subTitle}>{user?.userName}</Text>
                    </View>
                </LinearGradient>

                <Image source={{uri: post?.imageUrl}} style={styles.image} />

                <View style={styles.infoContainer}>
                    <View style={{flexDirection: "row"}}>
                        <IconButton 
                            Icon={() => <Assets.icons.Heart width={30} height={30} fill="#021c1b"/>} 
                            onPress={() => {}} />
                        <IconButton
                            Icon={() => <Assets.icons.Comment width={30} height={30} fill="#021c1b"/>} 
                            onPress={() => {}} />
                    </View>

                    <Text style={styles.description}>{post?.description}</Text>
                </View>

            </View>

            <View style={styles.mapContainer}>
                    <MapView region={mapRegion} style={styles.map}>
                        <Marker coordinate={mapRegion}>

                        </Marker>
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
        flexDirection: "row", 
        alignItems: "center",
        justifyContent: "space-between", 
        backgroundColor: "rgba(154, 171, 171, 0.8)",
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        width: "100%",
        padding: 10,
    },
    description: {
        width: "75%",
    },
    mapContainer: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    map: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
});