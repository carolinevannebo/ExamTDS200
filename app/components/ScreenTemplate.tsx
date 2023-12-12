// Source: John Nguyen, https://medium.com/@dev-john-nguyen/react-navigation-gradient-background-fc8d929386df

import { LinearGradient } from "expo-linear-gradient";
import { useHeaderHeight } from "@react-navigation/elements";

type ScreenTemplateProps = {
    children: React.ReactNode;
    headerPadding?: number;
}

const ScreenTemplate = ({ children, headerPadding }: ScreenTemplateProps) => {
    //useHeaderHeight is a hook that gives you the height of the header
    const headerHeight = useHeaderHeight();
     
    return (
        <LinearGradient 
        colors={['#ccd5d5', '#365857']}
        style={{ flex: 1, paddingTop: headerPadding ? headerHeight : 0 }}
        locations={[0, 1]}
        >
        {children}
        </LinearGradient>
    )
}

export default ScreenTemplate;