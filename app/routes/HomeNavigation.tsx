// Navigation tabs for logged in users

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import HomeIcon from "../assets/icons/HomeIcon";
import ProfileIcon from "../assets/icons/ProfileIcon";

const Tab = createBottomTabNavigator();

const HomeNavigation: React.FC = () => {
    return (
        <Tab.Navigator initialRouteName="Feed" screenOptions={screenOptions}>
            <Tab.Screen 
            name="Feed" 
            component={HomePage}
            options={{
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
    headerShown: false,
    tabBarActiveTintColor: '#f0fdfa',
    tabBarInactiveTintColor: '#1d4342',
    tabBarStyle: { 
        backgroundColor: '#1d4342',
        padding: 10
    },
}

export default HomeNavigation;