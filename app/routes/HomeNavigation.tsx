// Navigation tabs for logged in users

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import { ModalStateContext, IModalStateContext } from "../contexts/ModalStateContext";
import { useContext } from "react";
import Assets from "../Assets";
import IconButton from "../components/IconButton";
import { View } from "react-native";

const Tab = createBottomTabNavigator();

const HomeNavigation: React.FC = () => {
    const { openModal } = useContext(ModalStateContext) as IModalStateContext;
    
    return (
        <Tab.Navigator initialRouteName="Feed" screenOptions={screenOptions}>
            <Tab.Screen 
            name="Feed"
            component={HomePage}
            options={{
                headerTitle: "",
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
                headerShown: false,
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
    tabBarInactiveTintColor: '#1d4342',
    tabBarStyle: { 
        backgroundColor: '#1d4342',
        padding: 10
    },
    headerStyle: {
        backgroundColor: '#ccd5d5',
    },
}

export default HomeNavigation;