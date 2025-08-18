"use client";

import { useEffect } from "react";
import Modal from "react-modal-component-by-jeremy";
import UserNameManager from "./UserNameManager";
import { onUserNameUpdated } from "@entities/models/userName/bus";
import { useUserNameForm } from "@entities/models/userName/hooks";

interface UserNameModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserNameModal({ isOpen, onClose }: UserNameModalProps) {
    const { refresh } = useUserNameForm();

    // Quand le modal est ouvert et qu'un event est émis ailleurs → rafraîchir
    useEffect(() => {
        if (!isOpen) return;
        const unsub = onUserNameUpdated(() => {
            void refresh();
        });
        return unsub;
    }, [isOpen, refresh]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Mon pseudo public" type="info">
            <UserNameManager />
        </Modal>
    );
}
