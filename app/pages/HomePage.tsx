// User feed page, also known as the home page
// TODO: useUserContext instead of passing props
// BUG: Upon first opening the app, the home page is blank.
//      User has to switch tab and go back for home page to load.
//      Loading data is slower than rendering the page. FIX: Use a loading indicator?

import { StyleSheet, ScrollView, RefreshControl, View, Alert } from 'react-native';
import { CreatePostModal, PostItem, ScreenTemplate } from '../components';
import { useState, useCallback, useEffect } from 'react';
import { useUserContext } from '../contexts';
import { User } from '../models';

interface HomePageProps {
    users: User[];
    getUsers: () => Promise<void>;
}

//const HomePage: React.FC<HomePageProps> = ({users, getUsers}) => {
const HomePage: React.FC = () => {
    const { otherUsers, getOtherUsers } = useUserContext();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        try {
            if (!otherUsers) {
                getOtherUsers();
            }
            //getOtherUsers()
        } catch (error) {
            console.log("Error during refresh: ", error);
            Alert.alert("Error", (error as Error).message);
        } finally {
            setRefreshing(false);
        }
        //getUsers().finally(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        if (!otherUsers) {
            getOtherUsers();
        }
    }, []);

    return (
        <ScreenTemplate headerPadding={50}>
            <View style={styles.container}>
                <CreatePostModal />
            <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            >
                {otherUsers && otherUsers.map((user, index) => (
                    user.posts.map((post, index) => (
                        <PostItem 
                        key={`${user.uid}-${index}`} 
                        item={post} 
                        user={user} />
                    ))
                ))}
            </ScrollView>
            </View>
        </ScreenTemplate>
    )
};

export default HomePage;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 50,
        height: "100%",
    },
});