// User feed page, also known as the home page

import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserContext } from '../contexts';
import { CreatePostModal, PostItem, ScreenTemplate } from '../components';
import { User } from '../models';

const HomePage: React.FC = () => {
    const { otherUsers, getOtherUsers } = useUserContext();
    const [refreshing, setRefreshing] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getOtherUsers()
        /*.then(() => {
            setUsers(otherUsers);
        })*/
        .catch((error) => {
            console.error(error);
        })
        setRefreshing(false);
    }, []);

    useEffect(() => {
        setUsers(otherUsers);
    }, [users]);


    return (
        <ScreenTemplate headerPadding={50}>
            <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
            <CreatePostModal />
                {otherUsers && otherUsers.map((user, index) => (
                    user.posts.map((post, index) => (
                        <PostItem 
                        key={`${user.uid}-${index}`} 
                        item={post} 
                        user={user} />
                    ))
                ))}
            </ScrollView>
        </ScreenTemplate>
    )
};

export default HomePage;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 50
    },
});