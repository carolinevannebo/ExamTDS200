// Navigation hook for routing

import { useNavigation, NavigationProp } from "@react-navigation/native";

export type RouteList = {
    WelcomePage: undefined;
    Register: undefined;
    LogIn: undefined;
    HomeNavigation: undefined;
    FeedNavigation: undefined;
    ProfileNavigation: undefined;
    HomePage: undefined;
    ProfilePage: undefined,
    PostDetailPage?: {postUserId: string, postId: string},
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

    const setParams = (param: {postUserId: string, postId: string}) => {
        return navigation.setParams(param);
    }

    return { navigate, goBack, setParams};
};

export default useOwnNavigation;