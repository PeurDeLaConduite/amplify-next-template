// src/entities/models/userName/hooks.tsx
import { useCallback } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useModelForm } from "@entities/core/hooks";
import { userNameService } from "@entities/models/userName/service";
import {
    initialUserNameForm,
    toUserNameForm,
    toUserNameCreate,
    toUserNameUpdate,
} from "@entities/models/userName/form";
import { type UserNameFormType } from "@entities/models/userName/types";
import { emitUserNameUpdated } from "./bus";

export function useUserNameForm() {
    const { user } = useAuthenticator();
    const sub = user?.userId ?? user?.username ?? null;

    const load = useCallback(async () => {
        if (!sub) return null;
        const { data } = await userNameService.get({ id: sub });
        if (!data) return null;
        return toUserNameForm(data, [], []);
    }, [sub]);

    const create = useCallback(
        async (form: UserNameFormType) => {
            if (!sub) throw new Error("id manquant");
            const { data, errors } = await userNameService.create({
                id: sub,
                ...toUserNameCreate(form),
            });
            if (!data) throw new Error(errors?.[0]?.message ?? "Erreur création pseudo");
            emitUserNameUpdated(); // notify UI
            return data.id;
        },
        [sub]
    );

    // ⬇️ pas de refresh ici : submit() le fera
    const update = useCallback(
        async (form: UserNameFormType) => {
            if (!sub) throw new Error("id manquant");
            const { data, errors } = await userNameService.update({
                id: sub,
                ...toUserNameUpdate(form),
            });
            if (!data) throw new Error(errors?.[0]?.message ?? "Erreur mise à jour pseudo");
            emitUserNameUpdated(); // notify UI
            return data.id;
        },
        [sub]
    );

    const modelForm = useModelForm<UserNameFormType>({
        initialForm: initialUserNameForm,
        load,
        create,
        update,
        autoLoad: true,
        autoLoadExtras: false,
    });

    const { adoptInitial, setMessage, setForm, refresh, submit } = modelForm;

    const saveField = useCallback(
        async (field: keyof UserNameFormType, value: string) => {
            if (!sub) return;
            try {
                setMessage(null);
                const { errors } = await userNameService.update({
                    id: sub,
                    [field]: value as string,
                });
                if (errors?.length) throw new Error(errors[0].message);
                setForm((f) => ({ ...f, [field]: value })); // optimiste
                await refresh(); // vérité serveur
                emitUserNameUpdated(); // notify UI
            } catch (err) {
                setMessage(err instanceof Error ? err.message : String(err));
            }
        },
        [sub, setForm, setMessage, refresh]
    );

    const clearField = useCallback(
        async (field: keyof UserNameFormType) => {
            await saveField(field, "");
        },
        [saveField]
    );

    const remove = useCallback(async () => {
        if (!sub) return;
        try {
            const { errors } = await userNameService.delete({ id: sub });
            if (errors?.length) throw new Error(errors[0].message);
            adoptInitial(initialUserNameForm, "create");
            await refresh();
            emitUserNameUpdated();
        } catch (err) {
            setMessage(err instanceof Error ? err.message : String(err));
        }
    }, [sub, adoptInitial, refresh, setMessage]);

    return {
        ...modelForm,
        submit, // submit() déclenche déjà le refresh via load
        refresh,
        saveField,
        clearField,
        remove,
    };
}
