// Navigation tabs for logged in users

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import ProfileNavigation from "./ProfileNavigation";
import FeedNavigation from "./FeedNavigation";
import { useModalStateContext } from "../contexts";
import { IconButton } from '../components';
import { View} from "react-native";
import Assets from "../Assets";

const Tab = createBottomTabNavigator();

const HomeNavigation: React.FC = () => {
    const { openModal } = useModalStateContext();

    return (
        <Tab.Navigator initialRouteName="FeedNavigation" screenOptions={screenOptions}>
            <Tab.Screen
            name="FeedNavigation"
            component={FeedNavigation}
            options={{
                headerTitle: "",
                tabBarLabel: "Feed",
                tabBarIcon: ({focused}) => (
                    <View style={{opacity: focused ? 0.95 : 0.5}}>
                        <Assets.icons.Home width={30} height={30} fill="#fff"/>
                    </View>
                ),
                headerRight: () => (
                    <IconButton Icon={() => 
                        <Assets.icons.Add width={30} height={30} fill="#1d4342"/>
                    } onPress={openModal} style={{marginRight: 15}} />
                )
            }}/>

            <Tab.Screen
            name="ProfileNavigation"
            component={ProfileNavigation}
            options={{
                headerTitle: "",
                tabBarLabel: "Profile",
                tabBarIcon: ({focused}) => (
                    <View style={{opacity: focused ? 0.95 : 0.5}}>
                        <Assets.icons.Profile width={30} height={30} fill="#fff"/>
                    </View>
                ),
                headerRight: () => (
                    <IconButton Icon={() => 
                        <Assets.icons.Gear width={30} height={30} fill="#1d4342"/>
                    } style={{marginRight: 10}} onPress={openModal} />
                ),
            }}/>
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
