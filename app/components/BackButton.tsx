import React from "react";
import {
  Pressable,
  StyleSheet
} from "react-native";
import BackIcon from "../assets/icons/BackIcon";
import { goBack } from '../routes/NavigationRef';

const BackButton: React.FC = () => {
    return (
        <Pressable onPress={() => goBack()} style={styles.button}>
            {<BackIcon />}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 60,
        left: 25,
        zIndex: 1,
    },
});

export default BackButton;