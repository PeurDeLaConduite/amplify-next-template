"use client";

import { createContext, ReactNode } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import useEntityManager from "@src/hooks/useEntityManager";
import {
    createUserName,
    deleteUserName,
    getUserName,
    updateUserName,
} from "@src/entities/models/userName/service";

interface UserNameEntity {
    userName: string;
}

interface UserNameContextValue {
    userName: string;
    refresh: () => Promise<void>;
}

export const UserNameContext = createContext<UserNameContextValue>({
    userName: "",
    refresh: async () => {},
});

export const UserNameProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuthenticator();

    const { formData, fetchData, update } = useEntityManager<UserNameEntity>({
        fetch: async () => {
            if (!user) return null;
            return getUserName(user.username);
        },
        create: async (data) => {
            if (!user) return;
            await createUserName(user.username, data.userName);
        },
        update: async (_entity, data) => {
            if (!user) return;
            await updateUserName(user.username, data.userName);
        },
        remove: async () => {
            if (!user) return;
            await deleteUserName(user.username);
        },
        labels: (field) => field,
        fields: ["userName"],
        initialData: { userName: "" },
    });

    void update;
    if (!user) return null;
    return (
        <UserNameContext.Provider value={{ userName: formData.userName, refresh: fetchData }}>
            {children}
        </UserNameContext.Provider>
    );
};
