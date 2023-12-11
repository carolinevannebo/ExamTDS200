import { Post } from "./Post";

export interface User {
    uid: string;
    email: string;
    userName: string;
    displayName: string;
    bio: string;
    profilePicture: string;
    following: number[];
    followers: number[];
    posts: Post[];
};