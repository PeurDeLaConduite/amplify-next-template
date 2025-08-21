// src/components/Profile/UserNameModal.tsx
"use client";
import React from "react";
import Modal from "react-modal-component-by-jeremy";
import UserNameManager from "./UserNameManager";

interface UserNameModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserNameModal({ isOpen, onClose }: UserNameModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Mon pseudo public" type="info">
            {/* ⛔️ pas de <UserNameManager<UserNameFormType> /> (pas générique) */}
            <UserNameManager />
        </Modal>
    );
}
