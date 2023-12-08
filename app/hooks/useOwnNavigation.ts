import React from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";

export type RouteList = {
    WelcomePage: undefined;
    SignUp: undefined;
    LogIn: undefined;
    HomePage: undefined;
};

type OwnNavigationProp = NavigationProp<RouteList>;

export const useOwnNavigation = () => {
    const navigation = useNavigation<OwnNavigationProp>();

    const navigate = (path: keyof RouteList) => {
        navigation.navigate(path);
    };

    const goBack = () => {
        navigation.goBack();
    };

    return { navigate, goBack};
};

export default useOwnNavigation;