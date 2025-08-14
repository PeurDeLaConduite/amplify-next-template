// src/entities/models/userName/hooks.tsx
import { useCallback, useEffect } from "react";
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

export function useUserNameForm() {
    const { user } = useAuthenticator();
    const sub = user?.userId ?? user?.username;

    const modelForm = useModelForm<UserNameFormType>({
        initialForm: initialUserNameForm,
        create: async (form) => {
            if (!sub) throw new Error("id manquant");
            // ✅ plus de cast, et pas de 'owner'
            const { data, errors } = await userNameService.create({
                id: sub,
                ...toUserNameCreate(form), // doit retourner { userName }
            } as unknown as Parameters<typeof userNameService.create>[0]);
            if (!data) throw new Error(errors?.[0]?.message ?? "Erreur création pseudo");
            return data.id;
        },
        update: async (form) => {
            if (!sub) throw new Error("id manquant");
            const { data, errors } = await userNameService.update({
                id: sub,
                ...toUserNameUpdate(form), // doit retourner { userName }
            });
            if (!data) throw new Error(errors?.[0]?.message ?? "Erreur mise à jour pseudo");
            return data.id;
        },
    });

    const { adoptInitial, setMessage, setForm } = modelForm;

    const fetchUserName = useCallback(async (): Promise<UserNameFormType | null> => {
        if (!sub) return null;
        try {
            const { data } = await userNameService.get({ id: sub });
            if (!data) {
                adoptInitial(initialUserNameForm, "create");
                return null;
            }
            const form = toUserNameForm(data, [], []);
            adoptInitial(form, "edit");
            return form;
        } catch (err) {
            setMessage(err instanceof Error ? err.message : String(err));
            return null;
        }
    }, [sub, adoptInitial, setMessage]);

    // 🔁 charge l'état (create vs edit) au montage
    useEffect(() => {
        void fetchUserName();
    }, [fetchUserName]);

    const saveField = async (field: keyof UserNameFormType, value: string): Promise<void> => {
        if (!sub) return;
        try {
            setMessage(null);
            const { errors } = await userNameService.update({ id: sub, [field]: value } as never);
            if (errors?.length) throw new Error(errors[0].message);
            setForm((f) => ({ ...f, [field]: value as never }));
        } catch (err) {
            setMessage(err instanceof Error ? err.message : String(err));
        }
    };

    const clearField = async (field: keyof UserNameFormType): Promise<void> => {
        await saveField(field, "");
    };

    const remove = async () => {
        if (!sub) return;
        try {
            const { errors } = await userNameService.delete({ id: sub });
            if (errors?.length) throw new Error(errors[0].message);
            adoptInitial(initialUserNameForm, "create");
        } catch (err) {
            setMessage(err instanceof Error ? err.message : String(err));
        }
    };

    return { ...modelForm, fetchUserName, saveField, clearField, remove };
}
