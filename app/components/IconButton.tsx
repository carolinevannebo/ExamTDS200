import { GestureResponderEvent, Pressable, StyleProp, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

type ButtonProps = {
    Icon: React.FC<SvgProps>;
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
    style?: StyleProp<ViewStyle>;
}

const IconButton: React.FC<ButtonProps> = ({Icon, onPress, style}) => {
    return (
        <Pressable onPress={onPress} style={style}>
            {Icon && <Icon />}
        </Pressable>
    )
}

export default IconButton;