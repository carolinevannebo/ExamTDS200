import { Text, StyleSheet, Image, View } from "react-native";
import { useEffect, useState } from "react";
import { Post, User } from "../models";
import { IconButton, ScreenTemplate } from "../components";
import Assets from "../Assets";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserContext } from "../contexts";

type PostDetailPageProps = {
    postUserId: string;
    postId: string;
}

const PostDetailPage: React.FC<PostDetailPageProps> = ({postUserId, postId}) => {
    const { getUserPost } = useUserContext();
    const [post, setPost] = useState<Post | undefined>(undefined);

    useEffect(() => {
        getUserPost(postUserId, postId)
        .then((post) => {
            setPost(post);
        })
        .catch((error) => {
            console.error(error);
        })
    }, []);

    //console.log("User Id for post", postUserId);
    //console.log("Post Id for post", postId);
    console.log("Post in postdetailpage", post);
    return (
        <ScreenTemplate headerPadding={0}>
            <SafeAreaView style={styles.container}>
                <Image source={{uri: post?.imageUrl}} style={{width: 360, height: 360}} />
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <IconButton 
                        Icon={() => <Assets.icons.Heart width={30} height={30} fill="#021c1b"/>} 
                        onPress={() => {}} />
                    <Text>{post?.description}</Text>
                </View>
                <Text>PostDetailPage for {postUserId}</Text>
                <Text>Post Id {postId}</Text>
                
            </SafeAreaView>
        </ScreenTemplate>
    )
};

export default PostDetailPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});