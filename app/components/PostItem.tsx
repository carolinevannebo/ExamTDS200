import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import IconButton from './IconButton';
import ProfilePicture from "./ProfilePicture";
import { Post, User } from "../models";
import Assets from "../Assets";
import { navigate, setParams } from "../routes";
import { useUserContext } from "../contexts";

interface PostItemProps {
    user: User;
    item: Post;
}

const PostItem: React.FC<PostItemProps> = ({item, user}: PostItemProps) => {
    const { setUserIdForPost, setIdForPost } = useUserContext();

    const handlePress = () => {
        setUserIdForPost(user.uid!);
        setIdForPost(item.imageName);
        navigate("PostDetailPage", {postUserId: user.uid, postId: item.imageName});
    }

    return (
        <View key={item.imageName} style={{marginVertical: 7}}>
            <Pressable onPress={handlePress}>
                <ProfilePicture size={50} user={user} style={styles.profilePicture} />
                <Image source={{uri: item.imageUrl}} style={{width: 360, height: 360}} />
            </Pressable>

            <LinearGradient 
            colors={["rgba(154, 171, 171, 0.8)", "rgba(154, 171, 171, 0.3)"]}
            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
            style={styles.toolbar}>
                <Text>{item.description}</Text>
                <IconButton 
                    Icon={() => <Assets.icons.Heart width={30} height={30} fill="#021c1b"/>} 
                    onPress={() => {}} />
            </LinearGradient>
        </View>
    )
}

export default PostItem;

/*<IconButton
    Icon={() => <Assets.icons.Comment width={30} height={30} fill="#021c1b"/>} 
    onPress={() => {}} style={{padding: 10}} />*/

const styles = StyleSheet.create({
    profilePicture: {
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 1,
    },
    toolbar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        position: "absolute", 
        width: 360, 
        height: 40, 
        padding: 10,
        bottom: 0, 
        left: 0, 
    },
});