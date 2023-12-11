// Navigation tabs for logged in users

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import { ModalStateContext, IModalStateContext } from "../contexts/ModalStateContext";
import { useContext, useEffect, useState } from "react";
import Assets from "../Assets";
import IconButton from "../components/IconButton";
import { View, Text } from "react-native";
import { getCurrentUser, auth } from "../services/firebaseconfig";
import { signOut } from "firebase/auth"; // TODO: sjekk om det er success eller error

const Tab = createBottomTabNavigator();

const HomeNavigation: React.FC = () => {
    const { openModal } = useContext(ModalStateContext) as IModalStateContext;
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        getCurrentUser()
          .then((user) => {
            setUserName(user.userName);
          })
          .catch((error) => {
            console.error(error.message);
          });
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
                headerTitle: `${userName}`,
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
                        } style={{marginRight: 10}} onPress={() => {}} />

                        <IconButton Icon={() => 
                            <Assets.icons.Logout width={30} height={30} fill="#1d4342"/>
                        } onPress={() => (signOut(auth))} />
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