import React from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet
} from "react-native";
import { SvgProps } from 'react-native-svg';

interface IButtonProps {
    Icon?: React.FunctionComponent<SvgProps>;
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
}

const BackButton: React.FC<IButtonProps> = ({ Icon, onPress }) => {
    return (
        <Pressable onPress={onPress}>
            {Icon && <Icon width={16} height={16} />}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    
});

export default BackButton;