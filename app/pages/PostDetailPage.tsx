import { Text, StyleSheet } from "react-native";
import { Post, User } from "../models";
import { IconButton, ScreenTemplate } from "../components";
import Assets from "../Assets";
import { goBack } from "../routes";
import { SafeAreaView } from "react-native-safe-area-context";

interface PostDetailPageProps {
    item?: Post;
    user?: User;
}

const PostDetailPage: React.FC<PostDetailPageProps> = ({item, user}) => {
    return (
        <ScreenTemplate headerPadding={0}>
            <SafeAreaView style={styles.container}>
                <Text>PostDetailPage for {user?.userName}</Text>
                <Text>Post description: {item?.description}</Text>
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