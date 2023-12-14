// Navigation for the Profile tab

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfilePage, PostDetailPage } from "../pages";
import { Text } from "react-native";
import { useUserContext } from "../contexts";
import { Fragment } from "react";

const { Navigator, Screen } = createNativeStackNavigator();

const ProfileNavigation: React.FC = () => {
    const { currentUser, getCurrentUser, postUserId, postId } = useUserContext();
    
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

            <Screen 
            name="PostDetailPage"
            options={{
                headerTitle: "",
                headerLeft: () => (<Fragment></Fragment>),
            }}>
                { () => 
                    <PostDetailPage postUserId={postUserId} postId={postId}/>
                }
            </Screen>
        </Navigator>
    )
}

export default ProfileNavigation;