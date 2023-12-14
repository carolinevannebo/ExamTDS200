import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomePage, PostDetailPage } from "../pages";
import { View, Text } from "react-native";
import { IconButton } from "../components";
import { useModalStateContext, useUserContext } from "../contexts";
import Assets from "../Assets";
import { Fragment, useEffect } from "react";
import { goBack } from "./NavigationRef";
import { User } from "../models";

const { Navigator, Screen } = createNativeStackNavigator();

const FeedNavigation: React.FC = () => {
    const { otherUsers, getOtherUsers } = useUserContext();
    const { postUserId, postId } = useUserContext();
    //const { openModal } = useModalStateContext();
    
    return (
        <Navigator initialRouteName='HomePage' screenOptions={{headerTransparent: true}}>
            <Screen 
            name="HomePage"
            //component={HomePage}
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
            }}>
                {() => 
                    <HomePage users={otherUsers} getUsers={getOtherUsers} />
                }
            </Screen>

            <Screen 
            name="PostDetailPage" 
            //component={PostDetailPage}
            initialParams={{item: undefined, user: undefined}}
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

export default FeedNavigation;