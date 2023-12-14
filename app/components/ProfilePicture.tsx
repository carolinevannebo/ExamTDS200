// Reusable circle profile picture component

import { Image, ImageStyle, StyleSheet } from "react-native";
import Assets from "../Assets";
import { User } from "../models";

interface ProfilePictureProps {
    size: number;
    user: User;
    style?: ImageStyle;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({size, user, style}: ProfilePictureProps) => {
    const styles = StyleSheet.create({
        profilePicture: {
            width: size,
            height: size,
            borderRadius: size / 2,
        },
    });

    if (user?.profilePicture !== "default") { // use old upload if any
        return (
            <Image style={[styles.profilePicture, style]} source={{uri: user?.profilePicture}} />
        )
    } else { // use placeholder
        return (
            <Image style={[styles.profilePicture, style]} source={Assets.images.placeholder.profile} />
        )
    }
}

export default ProfilePicture;
