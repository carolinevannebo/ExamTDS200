// Context for user data to use across components
//TODO: fjern posts

import { useEffect, useState, createContext, ReactNode, useContext } from "react";
import DownloadService from "../services/DownloadService";
import { User, Post } from "../models";

export interface IUserContext {
    currentUser: User | null;
    otherUsers: User[];
    postUserId: string;
    postId: string;
    getCurrentUser: () => Promise<void>;
    getOtherUsers: () => Promise<void>;
    setUserIdForPost: (userId: string) => void;
    setIdForPost: (userId: string) => void;
    getUserById: (userId: string) => Promise<User | undefined>;
    getUserPost: (userId: string, postId: string) => Promise<Post | undefined>;
}

export const UserContext = createContext<IUserContext | null>(null);
export const useUserContext = () => useContext(UserContext) as IUserContext;

type Props = { children: ReactNode };

const UserProvider = ({ children }: Props) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [otherUsers, setOtherUsers] = useState<User[]>([]); 
    const [postUserId, setPostUserId] = useState<string>("");
    const [postId, setPostId] = useState<string>("");

    useEffect(() => {
        //getCurrentUser();
        getOtherUsers();
    }, []);

    const getCurrentUser = async () => {
        try {
            console.log("getCurrentUser called, using firebase")
            const user = await DownloadService.getCurrentUser()
            setCurrentUser(user);
        } catch (error) {
            console.error(error);
        }
    };

    const getOtherUsers = async () => {
        try {
            console.log("getOtherUsers called, using firebase")
            const users = await DownloadService.getOtherUsers()
            setOtherUsers(users);
        } catch (error) {
            console.error(error);
        }
    };

    const setUserIdForPost = (userId: string) => {
        setPostUserId(userId);
    };

    const setIdForPost = (userId: string) => {
        setPostId(userId);
    };

    const getUserById = async (userId: string) => {
        try {
            const user = await DownloadService.getUserById(userId);
            return user;
        } catch (error) {
            console.error('Error getting user:', error);
            return;
        }
    };

    const getUserPost = async (userId: string, postId: string) => {
        try {
            const user = await DownloadService.getUserById(userId);
            console.log("User in getUserPost", user);
            const post = user.posts.find((post) => post.imageName === postId);
            console.log("Post in getUserPost", post);
            return post;
        } catch (error) {
            console.error('Error getting user post:', error);
            return;
        }
    };

    return (
        <UserContext.Provider 
        value={{ 
            currentUser, 
            otherUsers,
            postUserId,
            postId,
            getCurrentUser, 
            getOtherUsers,
            setUserIdForPost,
            setIdForPost,
            getUserById,
            getUserPost,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;