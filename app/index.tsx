// Entry point
// TODO: Add splash screen while loading data?
// TODO: As you didn't use expo-router as initially planned, 
//       restructure the app back to its original structure.
// TODO: Clean up package.json

import { Redirect } from "expo-router";
import { auth } from "./services/firebaseconfig";
import { HomeNavigation } from "./routes";
import { ModalStateProvider, UserProvider } from "./contexts";
import { Text } from "react-native";
import { navigate } from "./routes";
import { useEffect } from "react";

const index = () => {
    const userSignedIn = auth.currentUser;
    const initialRouteName = userSignedIn ? 'routes/HomeNavigation' : 'pages/WelcomePage';

    //return <Redirect href={initialRouteName}/>

    useEffect(() => {
        navigate(initialRouteName);
    }, [initialRouteName]);
}
export default index;