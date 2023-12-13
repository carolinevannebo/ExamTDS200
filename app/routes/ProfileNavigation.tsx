import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfilePage, PostDetailPage } from "../pages";
import { View, Text } from "react-native";
import { IconButton } from "../components";
import { useModalStateContext, useUserContext } from "../contexts";
import Assets from "../Assets";
import { useEffect } from "react";

const { Navigator, Screen } = createNativeStackNavigator();

const ProfileNavigation: React.FC = () => {
    const { currentUser, getCurrentUser } = useUserContext();
    const { openModal } = useModalStateContext();

    /*useEffect(() => {
        if (currentUser === undefined) {
            getCurrentUser();
        }
    }, []);*/
    
    return (
        <Navigator initialRouteName='ProfilePage' screenOptions={{headerTransparent: true}}>
            <Screen name="ProfilePage"
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
            }}>
                {() => 
                    <ProfilePage 
                        user={currentUser} 
                        getUser={getCurrentUser}
                    />
                }
            </Screen>

            <Screen name="PostDetailPage" component={PostDetailPage} />
        </Navigator>
    )
}

export default ProfileNavigation;