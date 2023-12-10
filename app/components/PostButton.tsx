import React from "react";
import {
  Pressable,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import AddIcon from "../assets/icons/AddIcon";

interface IPostButtonProps {
    onPress: (event: GestureResponderEvent) => void;
}

const PostButton: React.FC<IPostButtonProps> = ({onPress}) => {
    return (
        <Pressable onPress={onPress} style={styles.button}>
            {<AddIcon />}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        marginRight: 15,
    },
});

export default PostButton;