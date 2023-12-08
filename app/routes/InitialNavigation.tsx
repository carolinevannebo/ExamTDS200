/*import { NavigationContainer, ParamListBase, StackNavigationState } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationEventMap, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Register } from '../components/Register';
import { LogIn } from '../components/LogIn';
import WelcomePage from '../pages/WelcomePage';
import HomePage from '../pages/HomePage';
import { navigationRef } from './NavigationRef';
import { withLayoutContext } from 'expo-router';
import { Platform } from 'react-native';

const { Navigator, Screen } = createNativeStackNavigator();

const InitialNavigation: React.FC = () => {
    if(Platform.OS === 'web') {
        return (
            <NavigationContainer 
            independent={true}
            ref={navigationRef}
            >
                <Navigator initialRouteName='/pages/WelcomePage' screenOptions={screenOptions}>
                    <Screen name="/pages/WelcomePage" component={WelcomePage}/>
                    <Screen name="/components/SignUp" component={Register}/>
                    <Screen name="/components/LogIn" component={LogIn}/>
                    <Screen name="/pages/HomePage" component={HomePage} options={{
                        headerShown: false,
                    }}/>
                </Navigator>
            </NavigationContainer>
        )
    }
    return (
        <NavigationContainer 
        independent={true}
        ref={navigationRef}
        >
            <Navigator initialRouteName='WelcomePage' screenOptions={screenOptions}>
                <Screen name="WelcomePage" component={WelcomePage}/>
                <Screen name="SignUp" component={Register}/>
                <Screen name="LogIn" component={LogIn}/>
                <Screen name="HomePage" component={HomePage} options={{
                    headerShown: false,
                }}/>
            </Navigator>
        </NavigationContainer>
    );
}

const WebStack = withLayoutContext<
NativeStackNavigationOptions, 
typeof Navigator, 
StackNavigationState<ParamListBase>, 
NativeStackNavigationEventMap>(Navigator);

const screenOptions = {
    headerStyle: { backgroundColor: '#09090b'},
    headerTintColor: '#ecfeff',
    headerTitle: '',
}

export default InitialNavigation;*/