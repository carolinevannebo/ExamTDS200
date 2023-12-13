// Context for user data to use across components
//TODO: fjern posts

import { useEffect, useState, createContext, ReactNode, useContext } from "react";
import DownloadService from "../services/DownloadService";
import { User } from "../models";

export interface IUserContext {
    currentUser: User | null;
    otherUsers: User[];
    getCurrentUser: () => Promise<void>;
    getOtherUsers: () => Promise<void>;
}

export const UserContext = createContext<IUserContext | null>(null);
export const useUserContext = () => useContext(UserContext) as IUserContext;

type Props = { children: ReactNode };

const UserProvider = ({ children }: Props) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [otherUsers, setOtherUsers] = useState<User[]>([]);

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

    return (
        <UserContext.Provider 
        value={{ 
            currentUser, 
            otherUsers,
            getCurrentUser, 
            getOtherUsers,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;