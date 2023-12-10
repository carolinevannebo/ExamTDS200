// Navigation tabs for logged in users

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import HomeIcon from "../assets/icons/HomeIcon";
import ProfileIcon from "../assets/icons/ProfileIcon";
import PostButton from "../components/PostButton";
import { ModalStateContext, IModalStateContext } from "../contexts/ModalStateContext";
import { useContext } from "react";

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
                    <PostButton onPress={openModal} />
                ),
                tabBarIcon: ({focused}) => (
                    <HomeIcon style={{
                        opacity: focused ? 0.95 : 0.5
                    }}/>
                )
            }}/>

            <Tab.Screen 
            name="Profile" 
            component={ProfilePage}
            options={{
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <ProfileIcon style={{
                        opacity: focused ? 0.95 : 0.5
                        
                    }}/>
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