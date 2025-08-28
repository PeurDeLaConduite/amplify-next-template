/* app/auth-provider.tsx */
"use client";
import { Authenticator } from "@aws-amplify/ui-react";
// import "@aws-amplify/ui-react/styles.css";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return <Authenticator.Provider>{children}</Authenticator.Provider>;
}
