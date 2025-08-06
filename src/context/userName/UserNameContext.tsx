"use client";

import { createContext, ReactNode } from "react";
import { useUserName } from "@src/entities";
import { useAuthenticator } from "@aws-amplify/ui-react";
interface UserNameContextValue {
    userName: string;
}

export const UserNameContext = createContext<UserNameContextValue>({
    userName: "",
});

export const UserNameProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuthenticator();

    const { userName } = useUserName();
    if (!user) return null;
    return <UserNameContext.Provider value={{ userName }}>{children}</UserNameContext.Provider>;
};
