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

    // Comparateur pour un dirty "propre"
    const isEqual = useCallback(
        (a: UserNameFormType, b: UserNameFormType) =>
            (a.userName ?? "").trim() === (b.userName ?? "").trim(),
        []
    );

    // Fournir load() pour que refresh() refonctionne partout
    const load = useCallback(async () => {
        const id = editingId ?? sub;
        if (!id) return null;
        const { data } = await userNameService.get({ id });
        return data ? toUserNameForm(data, [], []) : null;
    }, [editingId, sub]);

    const modelForm = useModelForm<UserNameFormType, Extras>({
        initialForm: initialUserNameForm,
        initialExtras: { userNames: [] },
        load, // ✅ permet refresh()
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
        autoLoad: true, // ✅ hydrate si id dispo
        autoLoadExtras: false,
        isEqual, // ✅ dirty stable
    });

    const { setForm, setMode, setExtras, reset, patchLocalForm, extras, refresh, adoptInitial } =
        modelForm;

    // Liste (cohérence avec author/tag/section)
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
                setEditingId(userName.id);
                adoptInitial(toUserNameForm(userName, [], []), "edit");
                return;
            }
            if (!sub) {
                setForm(initialUserNameForm);
                setMode("create");
                setEditingId(null);
                return;
            }
            // autoLoad + load() s'occuperont de l’hydratation
            setEditingId(sub);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName?.id, sub]);

    const selectById = useCallback(
        (id: string) => {
            const item = extras.userNames.find((u) => u.id === id) ?? null;
            if (item) {
                setEditingId(item.id);
                adoptInitial(toUserNameForm(item, [], []), "edit");
            }
            return item;
        },
        [extras.userNames, adoptInitial]
    );

    const removeById = useCallback(
        async (id: string) => {
            if (!window.confirm("Supprimer ce pseudo ?")) return;
            await userNameService.delete({ id });
            await fetchUserNames();
            if (editingId === id) {
                setEditingId(null);
                adoptInitial(initialUserNameForm, "create");
                reset();
            }
            await refresh(); // 🔄 maintenant effectif
            emitUserNameUpdated();
        },
        [editingId, reset, fetchUserNames, refresh, adoptInitial]
    );

    // Helpers “champ par champ”
    const updateField = useCallback(
        async (field: keyof UserNameFormType, value: string) => {
            const id = editingId ?? sub;
            if (!id) return;
            await userNameService.update({ id, [field]: value } as any);
            patchLocalForm({ [field]: value } as Partial<UserNameFormType>); // optimiste
            await refresh(); // vérité serveur
            emitUserNameUpdated();
        },
        [editingId, sub, patchLocalForm, refresh]
    );

    const clearField = useCallback(
        async (field: keyof UserNameFormType) => {
            await updateField(field, "");
        },
        [updateField]
    );

    return {
        ...modelForm,
        editingId,
        fetchUserNames,
        selectById,
        removeById,
        updateField,
        clearField,
    };
}
