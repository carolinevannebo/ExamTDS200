// Context for create post modal to use across components

import { useState, createContext, ReactNode } from "react";

export interface IModalStateContext {
    isModalVisible: boolean;
    openModal: () => void;
    closeModal: () => void;
}

export const ModalStateContext = createContext<IModalStateContext | null>(null);

type Props = { children: ReactNode };

const ModalStateProvider = ({ children }: Props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const openModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    return (
        <ModalStateContext.Provider value={{ isModalVisible, openModal, closeModal }}>
            {children}
        </ModalStateContext.Provider>
    );
};

export default ModalStateProvider;