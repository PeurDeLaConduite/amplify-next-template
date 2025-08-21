// src/app/profile/UserNameManager.tsx
"use client";
import React, { useCallback } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import EntityEditor from "@components/forms/EntityEditor";
import { label as fieldLabel } from "./utilsUserName";
import PersonIcon from "@mui/icons-material/Person";
import { useUserNameManager } from "@entities/models/userName";
import { useUserNameRefresh } from "@entities/models/userName/useUserNameRefresh";
import { type UserNameFormType, initialUserNameForm } from "@entities/models/userName";
import { getUserSub } from "@entities/core/auth/getUserSub"; // ✅ ID fiable (sub)


type IdLike = string | number;
const fields: (keyof UserNameFormType)[] = ["userName"];

export default function UserNameManager() {
    const { user } = useAuthenticator();

    const manager = useUserNameManager(); // <-- le hook charge via getUserSub() en interne

    const { refresh, form, isEditing, editingId, savingCreate, savingUpdate } = manager;

    // ⚡ un seul hook pour auth-change + bus
    useUserNameRefresh({
        refresh,
        enabled: Boolean(user),
        onAuthChange: true,
    });

    type FieldValue = UserNameFormType[keyof UserNameFormType];

    const handleChange = (field: keyof UserNameFormType, value: FieldValue) => {
        manager.updateField(field, value);
    };

    const submit = async () => {
        // garde-fou UX
        const value = form.userName?.trim() ?? "";
        if (!value) {
            alert("Le pseudo ne peut pas être vide.");
            return;
        }

        // ✅ si le manager implémente l'upsert en interne, on peut rester simple :
        if (isEditing && editingId) {
            // patch minimal, évite d’écraser d’autres champs éventuels
            await manager.updateEntity(editingId, { userName: value });
        } else {
            // création avec id = sub gérée dans createEntity()
            const id = await manager.createEntity({ ...form, userName: value });
            manager.enterEdit(id);
        }
    };

    const reset = () => {
        manager.cancelEdit();
    };

    const setForm: React.Dispatch<React.SetStateAction<UserNameFormType>> = (value) => {
        const next = typeof value === "function" ? value(form) : value;
        manager.patchForm(next);
    };

    const saveField = async (field: keyof UserNameFormType, value: FieldValue) => {
        manager.updateField(field, value);
        await submit();
    };

    const clearField = async (field: keyof UserNameFormType) => {
        manager.clearField(field);
        await submit();
    };

    const handleDeleteById = useCallback(
        async (id: IdLike) => {
            await manager.deleteById(String(id));
        },
        [manager]
    );

    if (!user) return null;

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
            form={form}
            mode={isEditing ? "edit" : "create"}
            dirty={JSON.stringify(form) !== JSON.stringify(initialUserNameForm)}
            handleChange={handleChange}
            submit={submit}
            reset={reset}
            setForm={setForm}
            fields={fields}
            labels={fieldLabel}
            saveField={saveField}
            clearField={clearField}
            // ✅ delete : on s'assure d’avoir le bon ID (sub) si rien n’est passé
            deleteEntity={async (id?: string) => {
                const target = id ?? editingId ?? (await getUserSub()).toString(); // fallback sub (fiable)
                if (!target) return;
                await handleDeleteById(target);
            }}
            // (optionnel) désactivation pendant sauvegarde
            // disabled={savingCreate || savingUpdate}
        />
    );
}
