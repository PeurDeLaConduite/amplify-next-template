"use client";
import Modal from "react-modal-component-by-jeremy";
import UserNameManager from "./UserNameManager";

interface UserNameModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserNameModal({ isOpen, onClose }: UserNameModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Mon pseudo public" type="info">
            <UserNameManager />
        </Modal>
    );
}
