// Navigation hook for routing

import { useNavigation, NavigationProp } from "@react-navigation/native";
import { User, Post } from "../models";

export type RouteList = {
    WelcomePage: undefined;
    Register: undefined;
    LogIn: undefined;
    HomeNavigation: undefined;
    FeedNavigation: undefined;
    ProfileNavigation: undefined;
    HomePage: undefined;
    ProfilePage: undefined,
    PostDetailPage?: {user?: User, post?: Post},
}; // du trenger ikke alle routes her

type OwnNavigationProp = NavigationProp<RouteList>;

export const useOwnNavigation = () => {
    const navigation = useNavigation<OwnNavigationProp>();

    const navigate = (path: keyof RouteList) => {
        navigation.navigate(path);
    };

    const navigateWithDetails = (path: keyof RouteList, details?: any) => {
        navigation.navigate(path, details);
    };

    const goBack = () => {
        navigation.goBack();
    };

    return { navigate, goBack, navigateWithDetails};
};

export default useOwnNavigation;