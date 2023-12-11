// User feed page, also known as the home page

import React, { useState, useEffect, useCallback } from 'react';
import { Text, StyleSheet, Pressable, View, ScrollView, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserContext } from '../contexts';
import { CreatePostModal, IconButton } from '../components';
import { Post } from '../models';
import Assets from '../Assets';

const HomePage: React.FC = () => {
    const { otherUsers, otherPosts, getOtherPosts } = useUserContext();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getOtherPosts().finally(() => setRefreshing(false));
    }, []);
 
    useEffect(() => {
        if (otherPosts.length === 0) {
            getOtherPosts();
        }
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
                {otherPosts.map((value, index) => (
                    postItem({item: otherPosts[index]})
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