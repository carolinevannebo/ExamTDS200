import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigationRef } from "./routes/NavigationRef";
import WelcomePage from "./pages/WelcomePage";
import { Register } from "./components/Register";
import { LogIn } from "./components/LogIn";
import HomePage from "./pages/HomePage";

const { Navigator, Screen } = createNativeStackNavigator();

const Layout = () => {
    return (
        <NavigationContainer 
            independent={true}
            ref={navigationRef}
            >
                <Navigator initialRouteName='pages/WelcomePage' screenOptions={screenOptions}>
                    <Screen name="pages/WelcomePage" component={WelcomePage}/>
                    <Screen name="components/Register" component={Register}/>
                    <Screen name="components/LogIn" component={LogIn}/>
                    <Screen name="pages/HomePage" component={HomePage} options={{
                        headerShown: false,
                    }}/>
                </Navigator>
            </NavigationContainer>
    )
}

const screenOptions = {
    headerStyle: { backgroundColor: '#09090b'},
    headerTintColor: '#ecfeff',
    headerTitle: '',
}

export default Layout;