// Comment section for post detail page
// TODO: refactor styles

import { useState } from "react";
import { CommentData, User } from "../models";
import { Timestamp } from "firebase/firestore/lite";
import UploadService from "../services/UploadService";
import { TextInput, View, Text, Pressable } from "react-native";
import ProfilePicture from "./ProfilePicture";
import IconButton from "./IconButton";
import Assets from "../Assets";
import { useUserContext } from "../contexts";
import { navigate } from "../routes";


// TODO: refactor this into its own file
interface CommentSectionProps {
    comments: CommentData[];
    currentUser: User;
    postUserId: string;
    postId: string;
};

const CommentSection: React.FC<CommentSectionProps> = ({comments, currentUser, postUserId, postId}) => {
    const { setOtherUser } = useUserContext();
    const [userComment, setUserComment] = useState<string>("");

    const handleAddComment = () => {
        if (!userComment || userComment === "") return;

        const newComment: CommentData = {
            author: currentUser!,
            text: userComment,
            date: Timestamp.fromDate(new Date(Date.now())),
        };

        comments.push(newComment);
        console.log(newComment);
        // TODO: send to firebase OK
        UploadService.uploadComment(postUserId, postId, newComment);

        setUserComment("");
    };

    const formatDate = (timestamp: Timestamp) => {
        const dateObj = Timestamp.fromDate(timestamp.toDate());
        const dateStr = dateObj.toString().split(" ")[1] + " " + dateObj.toString().split(" ")[2] + ", " + dateObj.toString().split(" ")[3];

        return `${dateStr}`;
    };

    const handleNavigate = (user: User) => {
        setOtherUser(user); // nå krongler du litt
        navigate("ProfilePage");
    }

    return (
        <View style={{borderTopWidth: 0.8, borderTopColor: "#688281"}}>
            {comments.map((comment, index) => (
                <View key={index} style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginVertical: 5}}>
                    <Pressable onPress={() => handleNavigate(comment.author)}>
                        <ProfilePicture 
                        size={30} 
                        user={comment.author} 
                        style={{marginRight: 10}} />
                    </Pressable>

                    <View>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{fontWeight: "bold", width: "65%"}}>{comment.author.displayName}</Text>
                            <Text style={{marginRight: 5, color: "#688281"}}>{formatDate(comment.date)}</Text>
                        </View>

                        <Text>{comment.text}</Text>
                    </View>

                </View>
            ))}
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <TextInput 
                placeholder="Add a comment..."
                placeholderTextColor={"#688281"}
                value={userComment}
                onChangeText={(userComment) => setUserComment(userComment)}
                style={{marginTop: 5, marginLeft: 5, height: 30}} />

                <IconButton 
                Icon={() => <Assets.icons.Send 
                width={22} 
                height={22} 
                fill="#365857"/>} 
                onPress={handleAddComment}
                />
            </View>

        </View>
    );
};

export default CommentSection;