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

export function useUserNameForm() {
    const { user } = useAuthenticator();
    const sub = user?.userId ?? user?.username;

    const modelForm = useModelForm<UserNameFormType>({
        initialForm: initialUserNameForm,
        create: async (form) => {
            if (!sub) throw new Error("id manquant");
            const { data } = await userNameService.create({
                ...toUserNameCreate(form),
            } as unknown as Parameters<typeof userNameService.create>[0]);
            if (!data) throw new Error("Erreur lors de la création du pseudo");
            return data.id;
        },
        update: async (form) => {
            if (!sub) throw new Error("id manquant");
            const { data } = await userNameService.update({
                id: sub,
                ...toUserNameUpdate(form),
            });
            if (!data) throw new Error("Erreur lors de la mise à jour du pseudo");
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

    const saveField = async (field: keyof UserNameFormType, value: string): Promise<void> => {
        if (!sub) return;
        try {
            setMessage(null);
            await userNameService.update({ id: sub, [field]: value });
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
            await userNameService.delete({ id: sub });
            adoptInitial(initialUserNameForm, "create");
        } catch (err) {
            setMessage(err instanceof Error ? err.message : String(err));
        }
    };

    return { ...modelForm, fetchUserName, saveField, clearField, remove };
}
