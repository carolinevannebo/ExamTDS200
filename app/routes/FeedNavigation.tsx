// Navigation for the Feed tab

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomePage, PostDetailPage } from "../pages";
import { Text } from "react-native";
import { useUserContext } from "../contexts";
import { Fragment} from "react";

const { Navigator, Screen } = createNativeStackNavigator();

const FeedNavigation: React.FC = () => {
    const { otherUsers, getOtherUsers, postUserId, postId } = useUserContext();
    
    return (
        <Navigator initialRouteName='HomePage' screenOptions={{headerTransparent: true}}>
            <Screen 
            name="HomePage"
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