// src/components/Profile/UserNameModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import Modal from "react-modal-component-by-jeremy";
import UserNameManager from "./UserNameManager";
import { useUserNameForm } from "@entities/models/userName/hooks";
import { onUserNameUpdated } from "@entities/models/userName/bus";
import type { UserNameType } from "@entities/models/userName";

interface UserNameModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserNameModal({ isOpen, onClose }: UserNameModalProps) {
    const [editingProfile] = useState<UserNameType | null>(null);
    const manager = useUserNameForm(editingProfile);

    useEffect(() => {
        if (!isOpen) return;
        const unsub = onUserNameUpdated(() => {
            void manager.refresh();
        });
        return unsub;
    }, [isOpen, manager.refresh]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Mon pseudo public" type="info">
            <UserNameManager />
        </Modal>
    );
}
