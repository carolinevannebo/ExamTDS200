import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomePage, PostDetailPage } from "../pages";
import { View, Text } from "react-native";
import { IconButton } from "../components";
import { useModalStateContext, useUserContext } from "../contexts";
import Assets from "../Assets";
import { Fragment, useEffect } from "react";
import { goBack } from "./NavigationRef";

const { Navigator, Screen } = createNativeStackNavigator();

const FeedNavigation: React.FC = () => {
    //const { currentUser, getCurrentUser } = useUserContext();
    const { openModal } = useModalStateContext();

    /*useEffect(() => {
        if (currentUser === undefined) {
            getCurrentUser();
        }
    }, []);*/
    
    return (
        <Navigator initialRouteName='HomePage' screenOptions={{headerTransparent: true}}>
            <Screen 
            name="HomePage"
            component={HomePage}
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
            }}/>

            <Screen 
            name="PostDetailPage" 
            component={PostDetailPage}
            options={{
                headerTitle: "",
                headerLeft: () => (<Fragment></Fragment>),
                
            }}/>
        </Navigator>
    )
}

export default FeedNavigation;