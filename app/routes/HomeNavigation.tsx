// Navigation tabs for logged in users

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";

const Tab = createBottomTabNavigator();

const HomeNavigation: React.FC = () => {
    return (
        <Tab.Navigator initialRouteName="pages/HomePage">
            <Tab.Screen name="pages/HomePage" component={HomePage}/>
            <Tab.Screen name="pages/ProfilePage" component={ProfilePage}/>
        </Tab.Navigator>
    )
}

export default HomeNavigation;