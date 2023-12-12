// User feed page, also known as the home page

import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserContext } from '../contexts';
import { CreatePostModal, PostItem, ScreenTemplate } from '../components';

const HomePage: React.FC = () => {
    const { otherUsers, getOtherUsers } = useUserContext();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getOtherUsers().finally(() => setRefreshing(false));
    }, []);
 
    useEffect(() => {
        if (otherUsers.length === 0) {
            getOtherUsers();
        }
    }, [onRefresh]);

    return (
        <ScreenTemplate headerPadding={0}>
        <SafeAreaView style={styles.container}>
            <CreatePostModal />
            
            <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                {otherUsers.map((user, index) => (
                    user.posts.map((post, index) => (
                        <PostItem key={`${user.uid}-${index}`} item={post} user={user} />
                    ))
                ))}
            </ScrollView>

        </SafeAreaView>
        </ScreenTemplate>
    )
};

export default HomePage;
/**<ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                {otherPosts.map((_, index) => (
                    <PostItem key={index} item={otherPosts[index]} />
                ))}
            </ScrollView> */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#ccd5d5',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    }
});