import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import IconButton from './IconButton';
import { Post } from "../models";
import Assets from "../Assets";

interface PostItemProps {
    item: Post;
}

const PostItem: React.FC<PostItemProps> = ({item}: PostItemProps) => {
    return (
        <View key={item.imageName} style={{}}>
            <Image source={Assets.images.placeholder.profile} style={styles.profilePicture} />
            <Image source={{uri: item.imageUrl}} style={{width: 390, height: 390}} />

            <LinearGradient 
            colors={["rgba(154, 171, 171, 0.8)", "rgba(154, 171, 171, 0.3)"]}
            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
            style={styles.toolbar}>
                <Text>Username</Text>
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
        width: 50, 
        height: 50, 
        borderRadius: 25,
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 1,
    },
    toolbar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", 
        //backgroundImage: "linear-gradient(to right, rgba(154, 171, 171, 0.8), rgba(154, 171, 171, 0.5))", 
        position: "absolute", 
        left: 0, 
        bottom: 0, 
        width: 390, 
        height: 40, 
        padding: 10
    },
});