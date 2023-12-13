import { FieldValue, GeoPoint, Timestamp } from "firebase/firestore/lite";
import { User } from "./User";

export interface Post {
    imageName: string;
    imageUrl: string;
    createdAt: FieldValue;
    location: GeoPoint | undefined;
    description: string;
    comments?: CommentData[];
}

export interface CommentData {
    author: User;
    text: string;
    date: Timestamp;
};

// da skal createdAt være Timestamp... refaktorer