// User feed page, also known as the home page

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { StyleSheet, ScrollView, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserContext } from '../contexts';
import { CreatePostModal, PostItem, ScreenTemplate } from '../components';
import { User } from '../models';

interface HomePageProps {
    users: User[];
    getUsers: () => Promise<void>;
}

const HomePage: React.FC<HomePageProps> = ({users, getUsers}) => {
    //const { otherUsers, getOtherUsers } = useUserContext();
    const [refreshing, setRefreshing] = useState(false);
    //const [users, setUsers] = useState<User[]>([]);

    console.log("otherUsers in homepage: ", users)

    /*const onRefresh = useCallback(() => {
        setRefreshing(true);
        //getUsers().finally(() => setRefreshing(false));
        setRefreshing(false);
    }, []);*/

    /*useEffect(() => {
        console.log("homepage users: ", otherUsers);
        setUsers(otherUsers);
    }, [users])*/

    /*useEffect(() => {
        getUsers();
    }, []);*/


    return (
        <ScreenTemplate headerPadding={50}>
            <SafeAreaView style={styles.container}>
                <CreatePostModal />
            <ScrollView>
                {users.map((user, index) => (
                    user.posts.map((post, index) => (
                        <PostItem 
                        key={`${user.uid}-${index}`} 
                        item={post} 
                        user={user} />
                    ))
                ))}
            </ScrollView>
            </SafeAreaView>
        </ScreenTemplate>
    )
};

// refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}

export default HomePage;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 50,
        height: "100%",
    },
});