// Navigation hook for routing

import { useNavigation, NavigationProp } from "@react-navigation/native";

export type RouteList = {
    WelcomePage: undefined;
    Register: undefined;
    LogIn: undefined;
    HomeNavigation: undefined;
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