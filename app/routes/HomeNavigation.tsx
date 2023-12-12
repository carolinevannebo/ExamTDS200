// Navigation tabs for logged in users

import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useModalStateContext, useUserContext } from "../contexts";
import { HomePage, ProfilePage } from "../pages";
import { IconButton, ScreenTemplate } from '../components';
import Assets from "../Assets";
import { LinearGradient } from "expo-linear-gradient";

const Tab = createBottomTabNavigator();

const HomeNavigation: React.FC = () => {
    const { openModal } = useModalStateContext();
    const { currentUser, currentUserPosts, getCurrentUser, getCurrentUserPosts } = useUserContext();

    useEffect(() => {
        if (currentUser === null) {
            getCurrentUser();
        }
        /*DownloadService.getCurrentUser()
          .then((user) => {
            setUserName(user.userName);
            setUser(user);
          })
          .catch((error) => {
            console.error(error.message);
          });*/
    }, []);

    return (
        <Tab.Navigator initialRouteName="Feed" screenOptions={screenOptions}>
            <Tab.Screen 
            name="Feed"
            component={HomePage}
            options={{
                headerTitle: "",
                headerLeft: () => (
                    <Text style={{
                        color: '#1d4342',
                        fontSize: 23,
                        fontWeight: '400',
                        marginLeft: 20
                    }}>Explore</Text>
                ),
                headerRight: () => (
                    <IconButton Icon={() => 
                        <Assets.icons.Add width={30} height={30} fill="#1d4342"/>
                    } onPress={openModal} style={{marginRight: 15}} />
                ),
                tabBarIcon: ({focused}) => (
                    <View style={{opacity: focused ? 0.95 : 0.5}}>
                        <Assets.icons.Home width={30} height={30} fill="#fff"/>
                    </View>
                )
            }}/>

            <Tab.Screen 
            name="Profile" 
            options={{
                headerTitle: "",
                headerLeft: () => (
                    <Text style={{
                        color: '#1d4342',
                        fontSize: 23,
                        fontWeight: '400',
                        marginLeft: 20,
                    }}>{currentUser?.userName ?? "Username"}</Text>
                ),
                headerRight: () => (
                    <IconButton Icon={() => 
                        <Assets.icons.Gear width={30} height={30} fill="#1d4342"/>
                    } style={{marginRight: 10}} onPress={openModal} />
                ),
                tabBarIcon: ({focused}) => (
                    <View style={{opacity: focused ? 0.95 : 0.5}}>
                        <Assets.icons.Profile width={30} height={30} fill="#fff"/>
                    </View>
                )
            }}>
                {() => 
                    <ProfilePage 
                        user={currentUser} 
                        posts={currentUserPosts} 
                        getUser={getCurrentUser} 
                        getPosts={getCurrentUserPosts} 
                    />
                }
            </Tab.Screen>
        </Tab.Navigator>
    )
}

const screenOptions = {
    tabBarActiveTintColor: '#f0fdfa',
    tabBarInactiveTintColor: '#ccd5d5',
    tabBarStyle: {
        borderTopWidth: 0,
        padding: 10,
    },
    tabBarBackground: () => (
        <LinearGradient
        colors={['#365857', '#042f2e']}
        style={{ flex: 1, padding: 10 }}
        locations={[0, 1]}/>
    ),
    headerTransparent: true,
}

export default HomeNavigation;