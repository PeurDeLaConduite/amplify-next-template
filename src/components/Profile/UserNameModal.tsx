// src/components/Profile/UserNameModal.tsx
"use client";

import React, { useState } from "react";
import Modal from "react-modal-component-by-jeremy";
import UserNameManager from "./UserNameManager";
import { useUserNameForm } from "@entities/models/userName/hooks";
import { useUserNameRefresh } from "@entities/models/userName/useUserNameRefresh";
import type { UserNameType } from "@entities/models/userName";

interface UserNameModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserNameModal({ isOpen, onClose }: UserNameModalProps) {
    const [editingProfile] = useState<UserNameType | null>(null);
    const manager = useUserNameForm(editingProfile);

    // ⚡ écoute l’event bus seulement quand le modal est visible
    useUserNameRefresh({
        refresh: manager.refresh,
        enabled: isOpen,
        onAuthChange: false, // inutile ici
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Mon pseudo public" type="info">
            <UserNameManager />
        </Modal>
    );
}
