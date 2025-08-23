"use client";

import React, { useState, useCallback } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { EntityEditor } from "@components/ui/Form";
import { label as fieldLabel } from "./utilsUserProfile";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import { useUserProfileForm } from "@entities/models/userProfile/hooks";
import {
    type UserProfileFormType,
    type UserProfileType,
    initialUserProfileForm,
} from "@entities/models/userProfile";

type IdLike = string | number;

const fields: (keyof UserProfileFormType)[] = [
    "firstName",
    "familyName",
    "phoneNumber",
    "address",
    "postalCode",
    "city",
    "country",
];

export default function UserProfileManager() {
    const { user } = useAuthenticator();
    const [editingProfile, setEditingProfile] = useState<UserProfileType | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    // ✅ même signature que les autres managers (ex: useAuthorForm)
    const manager = useUserProfileForm(editingProfile);
    const { removeById, setForm, setMode, form } = manager;

    const handleDeleteById = useCallback(
        async (id: IdLike) => {
            await removeById(String(id));
            setEditingProfile(null);
            setEditingId(null);
            setMode("create");
            setForm(initialUserProfileForm);
        },
        [removeById, setMode, setForm]
    );

    if (!user) return null;

    const getIcon = (field: keyof UserProfileFormType) => {
        switch (field) {
            case "phoneNumber":
                return <PhoneIcon fontSize="small" className="text-gray-800" />;
            case "firstName":
            case "familyName":
                return <PersonIcon fontSize="small" className="text-gray-800" />;
            case "address":
            case "postalCode":
            case "city":
            case "country":
                return <HomeIcon fontSize="small" className="text-gray-800" />;
            default:
                return null;
        }
    };

    function formatPhoneNumber(number?: string): string {
        if (!number) return "";
        return number.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
    }

    const renderProfileField = (field: keyof UserProfileFormType, value: string) => {
        if (field === "phoneNumber") {
            return value ? (
                <a href={`tel:${value}`} className="text-base text-gray-900 hover:underline">
                    {formatPhoneNumber(value)}
                </a>
            ) : (
                <p className="text-sm text-gray-400 italic">Numéro non renseigné</p>
            );
        }
        return value ? (
            <p className="text-base text-gray-900 break-words">{value}</p>
        ) : (
            <p className="text-sm text-gray-400 italic">Information non disponible</p>
        );
    };

    return (
        <div className="mt-6">
            {/* Même approche que le modèle : un “header formulaire” + bouton enregistrer via ref */}
            <EntityEditor<UserProfileFormType>
                title="Mon profil"
                requiredFields={["firstName", "familyName"]}
                labelIcon={getIcon}
                renderValue={renderProfileField}
                deleteButtonLabel="Supprimer le profil"
                onClearField={(field, clear) => {
                    if (confirm(`Supprimer le contenu du champ "${fieldLabel(field)}" ?`)) {
                        void clear(field);
                    }
                }}
                form={form}
                mode={manager.mode}
                dirty={manager.dirty}
                setFieldValue={
                    manager.setFieldValue as (
                        field: keyof UserProfileFormType,
                        value: unknown
                    ) => void
                }
                submit={manager.submit}
                reset={manager.reset}
                setForm={manager.setForm}
                fields={fields}
                labels={(f) => fieldLabel(f as any)}
                updateField={manager.updateField}
                clearField={manager.clearField}
                // Wrapper “à la AuthorList.onDeleteById”
                deleteEntity={async (id?: string) => {
                    const target = id ?? editingId ?? user?.userId ?? user?.username ?? undefined;
                    if (!target) return;
                    await handleDeleteById(target);
                }}
            />
        </div>
    );
}
