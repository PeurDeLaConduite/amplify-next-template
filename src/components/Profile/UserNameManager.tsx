// src/app/profile/UserNameManager.tsx
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import EntityEditor from "@components/forms/EntityEditor";
import { label as fieldLabel } from "./utilsUserName";
import PersonIcon from "@mui/icons-material/Person";
import { useUserNameForm } from "@entities/models/userName/hooks";
import { onUserNameUpdated } from "@entities/models/userName/bus"; // ⬅️ importe emit
import {
    type UserNameFormType,
    type UserNameType,
    initialUserNameForm,
} from "@entities/models/userName";

type IdLike = string | number;
const fields: (keyof UserNameFormType)[] = ["userName"];

export default function UserNameManager() {
    const { user } = useAuthenticator();
    const [editingProfile, setEditingProfile] = useState<UserNameType | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const manager = useUserNameForm(editingProfile);
    const { removeById, setForm, setMode, refresh } = manager;

    // 🔄 Charger/rafraîchir au montage et quand l'utilisateur change
    useEffect(() => {
        if (user) void refresh();
    }, [user, refresh]);

    // 🔔 se resynchroniser si un autre écran met à jour le pseudo
    useEffect(() => {
        const unsub = onUserNameUpdated(() => {
            void refresh();
        });
        return unsub;
    }, [refresh]);

    const handleDeleteById = useCallback(
        async (id: IdLike) => {
            await removeById(String(id));
            setEditingProfile(null);
            setEditingId(null);
            setMode("create");
            setForm(initialUserNameForm);
        },
        [removeById, setMode, setForm] // initialUserNameForm est const, inutile de le mettre
    );

    if (!user) return <Authenticator />;

    return (
        <EntityEditor<UserNameFormType>
            title="Mon pseudo public"
            requiredFields={["userName"]}
            deleteLabel="Supprimer le pseudo"
            renderIcon={() => <PersonIcon fontSize="small" className="text-gray-800" />}
            onClearField={(field, clear) => {
                if (confirm(`Supprimer le contenu du champ "Pseudo public" ?`)) {
                    void clear(field);
                }
            }}
            form={manager.form}
            mode={manager.mode}
            dirty={manager.dirty}
            handleChange={
                manager.handleChange as (field: keyof UserNameFormType, value: unknown) => void
            }
            submit={manager.submit} // ⬅️ plus d’event ici
            reset={manager.reset}
            setForm={manager.setForm}
            fields={fields}
            labels={fieldLabel as (field: keyof UserNameFormType) => string}
            updateField={manager.updateField}
            clearField={manager.clearField}
            deleteEntity={async (id?: string) => {
                const target = id ?? editingId ?? user?.userId ?? user?.username ?? undefined;
                if (!target) return;
                await handleDeleteById(target);
            }}
        />
    );
}
