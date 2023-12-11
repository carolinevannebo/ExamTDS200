// Navigation tabs for logged in users

import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useModalStateContext, useUserContext } from "../contexts";
//import DownloadService from "../services/DownloadService";
import { auth } from "../services/firebaseconfig";
//import { User } from "../models";
import { HomePage, ProfilePage } from "../pages";
import { IconButton } from '../components';
import Assets from "../Assets";

const Tab = createBottomTabNavigator();

const HomeNavigation: React.FC = () => {
    const { openModal } = useModalStateContext();
    const { currentUser, getCurrentUser } = useUserContext();
    //const [userName, setUserName] = useState<string>('');
    //const [user, setUser] = useState<User>();
    const [openSettings, setOpenSettings] = useState<boolean>(false);

    useEffect(() => {
        getCurrentUser();
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
                        fontSize: 30,
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
            component={ProfilePage}
            options={{
                headerTitle: `${currentUser?.userName ?? "Username"}`,
                headerTitleStyle: {
                    color: '#1d4342',
                        fontSize: 30,
                        fontWeight: '400',
                        position: 'absolute',
                        right: -25,
                },
                headerRight: () => (
                    <View style={{marginRight: 15, flexDirection: "row"}}>
                        <IconButton Icon={() => 
                            <Assets.icons.Gear width={30} height={30} fill="#1d4342"/>
                        } style={{marginRight: 10}} onPress={() => setOpenSettings(true)} />

                        <IconButton Icon={() => 
                            <Assets.icons.Logout width={30} height={30} fill="#1d4342"/>
                        } onPress={() => (auth.signOut())} />
                    </View>

                ),
                tabBarIcon: ({focused}) => (
                    <View style={{opacity: focused ? 0.95 : 0.5}}>
                        <Assets.icons.Profile width={30} height={30} fill="#fff"/>
                    </View>
                )
            }}/>
        </Tab.Navigator>
    )
}

const screenOptions = {
    tabBarActiveTintColor: '#f0fdfa',
    tabBarInactiveTintColor: '#ccd5d5',
    tabBarStyle: { 
        backgroundColor: '#365857',
        padding: 10
    },
    headerStyle: {
        backgroundColor: '#ccd5d5',
    },
}

export default HomeNavigation;