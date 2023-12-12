// Context for user data to use across components

import { useEffect, useState, createContext, ReactNode, useContext } from "react";
import DownloadService from "../services/DownloadService";
import { User, Post } from "../models";

export interface IUserContext {
    currentUser: User | null;
    otherUsers: User[];
    currentUserPosts: Post[];
    otherPosts: Post[];
    getCurrentUser: () => Promise<void>;
    getOtherUsers: () => Promise<void>;
    getCurrentUserPosts: () => Promise<void>;
    //getOtherPosts: () => Promise<void>;
}

export const UserContext = createContext<IUserContext | null>(null);
export const useUserContext = () => useContext(UserContext) as IUserContext;

type Props = { children: ReactNode };

const UserProvider = ({ children }: Props) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [otherUsers, setOtherUsers] = useState<User[]>([]);
    const [currentUserPosts, setCurrentUserPosts] = useState<Post[]>([]);
    const [otherPosts, setOtherPosts] = useState<Post[]>([]);

    useEffect(() => {
        // prøv uten, du har limit på 1GB
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

    const getCurrentUserPosts = async () => {
        try {
            console.log("getCurrentUserPosts called, using firebase")
            const posts = await DownloadService.getUserPosts()
            setCurrentUserPosts(posts);
        } catch (error) {
            console.error(error);
        }
    };

    /*const getOtherPosts = async () => {
        try {
            console.log("getOtherPosts called, using firebase")
            //const posts = await DownloadService.getFeedPosts()
            //setOtherPosts(posts);

            otherUsers.forEach(async (user) => {
                user.posts.forEach(async (post) => {
                    setOtherPosts([...otherPosts, post]);
                });
            });
        } catch (error) {
            console.error(error);
        }
    };*/

    return (
        <UserContext.Provider 
        value={{ 
            currentUser, 
            otherUsers,
            currentUserPosts,
            otherPosts,
            getCurrentUser, 
            getOtherUsers,
            getCurrentUserPosts,
            //getOtherPosts
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;