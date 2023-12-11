// User feed page, also known as the home page

import React, { useState, useEffect} from 'react';
import { Text, StyleSheet, Pressable, View, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreatePostModal from './CreatePostModal';
import Assets from '../Assets';
import { getFeedPosts } from '../services/firebaseconfig';
import { Post } from '../models/Post';
import IconButton from '../components/IconButton';

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [testingUris, setTestingUris] = useState<string[]>([]);
 
    useEffect(() => {
        getFeedPosts()
            .then((posts) => {
                const clearedPosts = posts.filter((post) =>
                    post.imageUrl !== '')
                    .map((post) => post);
                    setPosts(clearedPosts);
                    setTestingUris(clearedPosts.map((post) => post.imageUrl));
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    const postItem = ({item}: {item: Post}) => {

        return (
            <View key={item.imageName} style={{marginVertical: 10}}>
                <Text style={{position: "absolute", left: 0, top: 0, zIndex: 1, fontSize: 20, color: "#000", margin: 15}}>Username</Text>

                <Image source={{uri: item.imageUrl}} style={{width: 390, height: 390}} />

                <View style={{ position: "absolute", left: 0, bottom: 0, width: 390, height: 40, backgroundColor: "rgba(154, 171, 171, 0.5)", justifyContent: "center"}}>
                    <IconButton 
                        Icon={() => <Assets.icons.Heart width={35} height={35} fill="#240405"/>} 
                        onPress={() => {}} style={{padding: 10}} />
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <CreatePostModal />
            
            <ScrollView>
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
});