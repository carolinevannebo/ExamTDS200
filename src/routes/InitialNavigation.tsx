import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Register } from '../components/Register';
import { LogIn } from '../components/LogIn';
import WelcomePage from '../pages/WelcomePage';
import HomePage from '../pages/HomePage';
import { navigationRef } from './NavigationRef';

const { Navigator, Screen } = createNativeStackNavigator();

const InitialNavigation: React.FC = () => {
    return (
        <NavigationContainer 
        independent={true}
        ref={navigationRef}
        >
            <Navigator initialRouteName='WelcomePage'>
                <Screen name="WelcomePage" component={WelcomePage} />
                <Screen name="SignUp" component={Register} />
                <Screen name="LogIn" component={LogIn} />
                <Screen name="HomePage" component={HomePage} />
            </Navigator>
        </NavigationContainer>
    );
}

export default InitialNavigation;