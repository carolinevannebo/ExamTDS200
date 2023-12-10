// Initial navigation upon starting the app for the first time

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigationRef } from "./routes/NavigationRef";
import WelcomePage from "./pages/WelcomePage";
import { Register } from "./components/Register";
import { LogIn } from "./components/LogIn";
import HomeNavigation from "./routes/HomeNavigation";
import ModalStateProvider from "./contexts/ModalStateContext";

const { Navigator, Screen } = createNativeStackNavigator();

const Layout = () => {
    return (
        <NavigationContainer 
            independent={true}
            ref={navigationRef}
            >
                <Navigator initialRouteName='routes/HomeNavigation' screenOptions={screenOptions}>
                    <Screen name="pages/WelcomePage" component={WelcomePage} />
                    <Screen name="components/Register" component={Register} />
                    <Screen name="components/LogIn" component={LogIn} />
                    <Screen name="routes/HomeNavigation">
                        {() => (
                            <ModalStateProvider>
                                <HomeNavigation />
                            </ModalStateProvider>
                        )}
                    </Screen>
                </Navigator>
            </NavigationContainer>
    )
}

const screenOptions = {
    headerShown: false,
}
/*const screenOptions = {
    headerStyle: { backgroundColor: '#042f2e' },
    headerTintColor: '#ecfeff',
    headerTitle: '',
}*/

export default Layout;