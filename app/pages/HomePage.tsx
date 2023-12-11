// User feed page, also known as the home page

import React, { useState, useEffect, useCallback} from 'react';
import { Text, StyleSheet, Pressable, View, ScrollView, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreatePostModal from './CreatePostModal';
import Assets from '../Assets';
import DownloadService from '../services/DownloadService';
import { Post } from '../models/Post';
import IconButton from '../components/IconButton';

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [testingUris, setTestingUris] = useState<string[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        DownloadService.getFeedPosts()
            .then((newPosts) => {
                    setPosts(newPosts);
                    setTestingUris(newPosts.map((post) => post.imageUrl));
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => setRefreshing(false));
    }, []);
 
    useEffect(() => {
        DownloadService.getFeedPosts()
            .then((posts) => {
                setPosts(posts);
                setTestingUris(posts.map((post) => post.imageUrl));
            })
            .catch((error) => {
                console.log(error);
            });

    }, [onRefresh]);

    const postItem = ({item}: {item: Post}) => {
        return (
            <View key={item.imageName} style={{}}>
                <Text style={{position: "absolute", left: 0, top: 0, zIndex: 1, fontSize: 20, color: "#000", margin: 15}}>Username</Text>

                <Image source={{uri: item.imageUrl}} style={{width: 390, height: 390}} />

                <View style={styles.postItemToolbar}>
                    <IconButton 
                        Icon={() => <Assets.icons.Heart width={30} height={30} fill="#021c1b"/>} 
                        onPress={() => {}} style={{padding: 10}} />
                    <IconButton
                        Icon={() => <Assets.icons.Comment width={30} height={30} fill="#021c1b"/>} 
                        onPress={() => {}} style={{padding: 10}} />
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <CreatePostModal />
            
            <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                {testingUris.map((uri, index) => (
                    postItem({item: posts[index]})
                ))}
            </ScrollView>

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
    postItem: {},
    postItemToolbar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start", 
        backgroundColor: "rgba(154, 171, 171, 0.5)", 
        position: "absolute", 
        left: 0, 
        bottom: 0, 
        width: 390, 
        height: 40, 
    },
});