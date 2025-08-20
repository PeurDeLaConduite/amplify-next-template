// src/entities/models/userName/hooks.tsx
import { useCallback, useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useModelForm } from "@entities/core/hooks";
import { userNameService } from "@entities/models/userName/service";
import {
    initialUserNameForm,
    toUserNameForm,
    toUserNameCreate,
    toUserNameUpdate,
} from "@entities/models/userName/form";
import type { UserNameFormType, UserNameType } from "@entities/models/userName/types";
import { emitUserNameUpdated } from "./bus";

type Extras = { userNames: UserNameType[] };

export function useUserNameForm(userName: UserNameType | null) {
    const { user } = useAuthenticator();
    const sub = user?.userId ?? user?.username ?? null;

    const [editingId, setEditingId] = useState<string | null>(userName?.id ?? sub ?? null);

    const modelForm = useModelForm<UserNameFormType, Extras>({
        initialForm: initialUserNameForm,
        initialExtras: { userNames: [] },
        create: async (form) => {
            const id = sub;
            if (!id) throw new Error("ID utilisateur introuvable");
            const { data, errors } = await userNameService.create({
                id,
                ...toUserNameCreate(form),
            });
            if (!data)
                throw new Error(errors?.[0]?.message ?? "Erreur lors de la création du pseudo");
            setEditingId(data.id);
            emitUserNameUpdated();
            return data.id;
        },
        update: async (form) => {
            const id = editingId ?? sub;
            if (!id) throw new Error("ID utilisateur introuvable");
            const { data, errors } = await userNameService.update({
                id,
                ...toUserNameUpdate(form),
            });
            if (!data)
                throw new Error(errors?.[0]?.message ?? "Erreur lors de la mise à jour du pseudo");
            setEditingId(data.id);
            emitUserNameUpdated();
            return data.id;
        },
        autoLoad: false,
        autoLoadExtras: false,
    });

    const { setForm, setMode, setExtras, reset, patch, extras } = modelForm;

    // Liste (pour cohérence avec author/tag/section)
    const fetchUserNames = useCallback(async () => {
        const { data } = await userNameService.list();
        setExtras((e) => ({ ...e, userNames: data ?? [] }));
    }, [setExtras]);

    useEffect(() => {
        void fetchUserNames();
    }, [fetchUserNames]);

    // Hydrate depuis la prop ou l’utilisateur courant (sub)
    useEffect(() => {
        void (async () => {
            if (userName) {
                setForm(toUserNameForm(userName, [], []));
                setMode("edit");
                setEditingId(userName.id);
                return;
            }
            const id = sub ?? null;
            if (!id) {
                setForm(initialUserNameForm);
                setMode("create");
                setEditingId(null);
                return;
            }
            const { data } = await userNameService.get({ id });
            if (data) {
                setForm(toUserNameForm(data, [], []));
                setMode("edit");
                setEditingId(data.id);
            } else {
                setForm(initialUserNameForm);
                setMode("create");
                setEditingId(id);
            }
        })();
    }, [userName, sub, setForm, setMode]);

    const selectById = useCallback(
        (id: string) => {
            const item = extras.userNames.find((u) => u.id === id) ?? null;
            if (item) {
                setForm(toUserNameForm(item, [], []));
                setMode("edit");
                setEditingId(item.id);
            }
            return item;
        },
        [extras.userNames, setForm, setMode]
    );

    const removeById = useCallback(
        async (id: string) => {
            if (!window.confirm("Supprimer ce pseudo ?")) return;
            await userNameService.delete({ id });
            await fetchUserNames();
            if (editingId === id) {
                setEditingId(null);
                reset();
            }
            emitUserNameUpdated();
        },
        [editingId, reset, fetchUserNames]
    );

    // Helpers “champ par champ” (à la manière des toggles dans tag/post)
    const saveField = useCallback(
        async (field: keyof UserNameFormType, value: string) => {
            const id = editingId ?? sub;
            if (!id) return;
            await userNameService.update({ id, [field]: value } as any);
            patch({ [field]: value } as Partial<UserNameFormType>);
            emitUserNameUpdated();
        },
        [editingId, sub, patch]
    );

    const clearField = useCallback(
        async (field: keyof UserNameFormType) => {
            await saveField(field, "");
        },
        [saveField]
    );

    return {
        ...modelForm,
        editingId,
        fetchUserNames,
        selectById,
        removeById,
        saveField,
        clearField,
    };
}
