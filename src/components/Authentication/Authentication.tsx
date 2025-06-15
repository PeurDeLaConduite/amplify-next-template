"use client";

import React from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";
import { configureI18n, formFields } from "@/src/utils/amplifyUiConfig";
import UserProfileGuard from "./UserProfileGuard";
import { useAuth } from "@/src/context/AuthContext";

// Configure AWS Amplify et i18n
Amplify.configure(outputs);
configureI18n();

export default function Authentication({ children }: { children: React.ReactNode }) {
    return (
        <Authenticator formFields={formFields}>
            {({ signOut, user }) => {
                return signOut && user ? (
                    <AmplifySync signOut={signOut}>
                        <UserProfileGuard signOut={signOut}>{children}</UserProfileGuard>
                    </AmplifySync>
                ) : (
                    <p>Chargement...</p>
                );
            }}
        </Authenticator>
    );
}

// Ce composant permet d'utiliser useEffect proprement
function AmplifySync({ signOut, children }: { signOut: () => void; children: React.ReactNode }) {
    const { setSignOutAmplify } = useAuth();

    React.useEffect(() => {
        setSignOutAmplify(() => signOut);
    }, [signOut, setSignOutAmplify]);

    return <>{children}</>;
}
