// src/components/profile/UserProfileManager.tsx
"use client";
import React, { useCallback } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import EntityEditor from "@components/forms/EntityEditor";
import { label as fieldLabel } from "./utilsUserProfile";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import { useUserProfileManager } from "@entities/models/userProfile";
import { type UserProfileFormType, initialUserProfileForm } from "@entities/models/userProfile";
import { getUserSub } from "@entities/core/auth/getUserSub";

// type IdLike = string | number;

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
    const manager = useUserProfileManager(); // ✅ toujours appelé
    const { form, isEditing, editingId } = manager;

    // ✅ ce hook doit être AVANT tout return conditionnel
    const handleDeleteById = useCallback(
        async (id: string) => {
            await manager.deleteById(String(id));
        },
        [manager]
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

    const renderValue = (field: keyof UserProfileFormType, value: string) => {
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

    type FieldValue = UserProfileFormType[keyof UserProfileFormType];

    const handleChange = (field: keyof UserProfileFormType, value: FieldValue) => {
        manager.updateField(field, value);
    };

    const submit = async () => {
        if (isEditing && editingId) {
            await manager.updateEntity(editingId, form);
        } else {
            const id = await manager.createEntity(form); // id = sub résolu côté manager
            manager.enterEdit(id);
        }
    };

    const reset = () => manager.cancelEdit();

    const setForm: React.Dispatch<React.SetStateAction<UserProfileFormType>> = (value) => {
        const next = typeof value === "function" ? value(form) : value;
        manager.patchForm(next);
    };

    const saveField = async (field: keyof UserProfileFormType, value: FieldValue) => {
        manager.updateField(field, value);
        await submit();
    };

    const clearField = async (field: keyof UserProfileFormType) => {
        manager.clearField(field);
        await submit();
    };

    return (
        <div className="mt-6">
            <EntityEditor<UserProfileFormType>
                title="Mon profil"
                requiredFields={["firstName", "familyName"]}
                renderIcon={getIcon}
                renderValue={renderValue}
                deleteLabel="Supprimer le profil"
                onClearField={(field, clear) => {
                    if (confirm(`Supprimer le contenu du champ "${fieldLabel(field)}" ?`)) {
                        void clear(field);
                    }
                }}
                form={form}
                mode={isEditing ? "edit" : "create"}
                dirty={JSON.stringify(form) !== JSON.stringify(initialUserProfileForm)}
                handleChange={handleChange}
                submit={submit}
                reset={reset}
                setForm={setForm}
                fields={fields}
                labels={fieldLabel}
                saveField={saveField}
                clearField={clearField}
                // Wrapper “à la AuthorList.onDeleteById”
                deleteEntity={async (id?: string) => {
                    const target = id ?? editingId ?? (await getUserSub()).toString(); // fallback sub (fiable)
                    if (!target) return;
                    await handleDeleteById(target);
                }}
            />
        </div>
    );
}
