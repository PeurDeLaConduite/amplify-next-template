// src/entities/models/userProfile/hooks.tsx
import { useCallback, useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useModelForm } from "@entities/core/hooks";
import { userProfileService } from "@entities/models/userProfile/service";
import { initialUserProfileForm, toUserProfileForm } from "@entities/models/userProfile/form";
import type { UserProfileFormType, UserProfileType } from "@entities/models/userProfile/types";
import { label as fieldLabel } from "@/src/components/Profile/utilsUserProfile";

type Extras = Record<string, never>;

export function useUserProfileForm(profile: UserProfileType | null) {
    const { user } = useAuthenticator();
    const sub = user?.userId ?? user?.username ?? null;

    const [editingId, setEditingId] = useState<string | null>(profile?.id ?? sub ?? null);

    const modelForm = useModelForm<UserProfileFormType, Extras>({
        initialForm: initialUserProfileForm,
        initialExtras: {},
        create: async (form) => {
            const id = sub;
            if (!id) throw new Error("ID utilisateur introuvable");
            const { data } = await userProfileService.create({ id, ...form });
            if (!data) throw new Error("Erreur lors de la création du profil");
            setEditingId(data.id);
            return data.id;
        },
        update: async (form) => {
            const id = editingId ?? sub;
            if (!id) throw new Error("ID utilisateur introuvable");
            const { data } = await userProfileService.update({ id, ...form });
            if (!data) throw new Error("Erreur lors de la mise à jour du profil");
            setEditingId(data.id);
            return data.id;
        },
        autoLoad: false,
        autoLoadExtras: false,
    });

    const { setForm, setMode, patchForm, reset } = modelForm;

    // Hydrate depuis la prop ou l’utilisateur courant (sub)
    useEffect(() => {
        void (async () => {
            if (profile) {
                setForm(toUserProfileForm(profile));
                setMode("edit");
                setEditingId(profile.id);
                return;
            }
            const id = sub ?? null;
            if (!id) {
                setForm(initialUserProfileForm);
                setMode("create");
                setEditingId(null);
                return;
            }
            const { data } = await userProfileService.get({ id });
            if (data) {
                setForm(toUserProfileForm(data));
                setMode("edit");
                setEditingId(data.id);
            } else {
                setForm(initialUserProfileForm);
                setMode("create");
                setEditingId(id);
            }
        })();
    }, [profile, sub, setForm, setMode]);

    // Cohérence avec les autres hooks : sélection/suppression par ID
    const selectById = useCallback(
        async (id: string) => {
            const { data } = await userProfileService.get({ id });
            if (data) {
                setForm(toUserProfileForm(data));
                setMode("edit");
                setEditingId(data.id);
            }
            return data ?? null;
        },
        [setForm, setMode]
    );

    const removeById = useCallback(
        async (id: string) => {
            if (!window.confirm("Supprimer ce profil ?")) return;
            await userProfileService.delete({ id });
            if (editingId === id) {
                setEditingId(null);
                reset();
            }
        },
        [editingId, reset]
    );

    // Helpers champ par champ (même esprit que toggle/updateEntity ailleurs)
    const updateEntity = useCallback(
        async (field: keyof UserProfileFormType, value: string) => {
            const id = editingId ?? sub;
            if (!id) return;
            await userProfileService.update({ id, [field]: value } as any);
            patchForm({ [field]: value } as Partial<UserProfileFormType>);
        },
        [editingId, sub, patchForm]
    );

    const clearField = useCallback(
        async (field: keyof UserProfileFormType) => {
            await updateEntity(field, "");
        },
        [updateEntity]
    );

    // Petit utilitaire conservé pour compat UI existante
    const labels = useCallback((field: keyof UserProfileFormType) => fieldLabel(field as any), []);

    return {
        ...modelForm,
        editingId,
        selectById,
        removeById,
        updateEntity,
        clearField,
        labels,
    };
}
