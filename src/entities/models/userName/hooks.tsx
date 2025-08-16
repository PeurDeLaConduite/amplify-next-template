import { useCallback, useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useModelForm } from "@entities/core/hooks";
import { userNameService } from "@entities/models/userName/service";
import {
    initialUserNameForm,
    toUserNameForm,
    // on ne s'appuie plus sur toUserNameCreate/Update pour le payload API
} from "@entities/models/userName/form";
import type { UserNameFormType } from "@entities/models/userName/types";

export function useUserNameForm() {
    const { user } = useAuthenticator();
    const sub = user?.userId ?? user?.username;
    const [loading, setLoading] = useState(false);

    const modelForm = useModelForm<UserNameFormType>({
        initialForm: initialUserNameForm,

        load: async () => {
            if (!sub) return null;
            const { data } = await userNameService.get({ id: sub });
            return data ? toUserNameForm(data, [], []) : null;
        },

        create: async (form) => {
            if (!sub) throw new Error("id manquant");
            // ⚠️ force à string, jamais null
            const userName = (form.userName ?? "").toString();
            const { data, errors } = await userNameService.create({ id: sub, userName });
            if (!data) throw new Error(errors?.[0]?.message ?? "Erreur création pseudo");
            return data.id;
        },

        update: async (form) => {
            if (!sub) throw new Error("id manquant");
            // On n'envoie que les champs attendus par l'API (sans null)
            const patch: { userName?: string } = {};
            if (form.userName !== undefined) patch.userName = (form.userName ?? "").toString();

            const { data, errors } = await userNameService.update({ id: sub, ...patch });
            if (!data) throw new Error(errors?.[0]?.message ?? "Erreur mise à jour pseudo");
            return data.id;
        },
    });

    const { adoptInitial, setMessage, setForm, refresh, submit, saving } = modelForm;

    const refreshWithLoading = useCallback(async () => {
        setLoading(true);
        try {
            await refresh();
        } finally {
            setLoading(false);
        }
    }, [refresh]);

    useEffect(() => {
        if (!sub) return;
        (async () => {
            setLoading(true);
            try {
                const { data } = await userNameService.get({ id: sub });
                adoptInitial(
                    data ? toUserNameForm(data, [], []) : initialUserNameForm,
                    data ? "edit" : "create"
                );
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sub]);

    const submitAndRefresh = useCallback(async () => {
        setLoading(true);
        try {
            await submit();
            await refresh();
        } finally {
            setLoading(false);
        }
    }, [submit, refresh]);

    // Typage strict : on ne manipule que 'userName' ici
    const saveField = async (field: "userName", value: string): Promise<void> => {
        if (!sub) return;
        setLoading(true);
        try {
            setMessage(null);
            const userName = (value ?? "").toString();
            const { errors } = await userNameService.update({ id: sub, userName });
            if (errors?.length) throw new Error(errors[0].message);
            setForm((f) => ({ ...f, userName }));
            await refresh();
        } catch (err) {
            setMessage(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    const clearField = async (field: "userName"): Promise<void> => {
        await saveField(field, "");
    };

    const remove = async () => {
        if (!sub) return;
        setLoading(true);
        try {
            const { errors } = await userNameService.delete({ id: sub });
            if (errors?.length) throw new Error(errors[0].message);
            adoptInitial(initialUserNameForm, "create");
            await refresh();
        } catch (err) {
            setMessage(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    return {
        ...modelForm,
        loading: loading || saving,
        submit: submitAndRefresh,
        refresh: refreshWithLoading,
        saveField,
        clearField,
        remove,
    };
}
