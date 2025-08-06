/* app/auth-provider.tsx */
"use client";

import { UserNameProvider } from "@src/context/userName/UserNameContext";
import { useAuthenticator } from "@aws-amplify/ui-react";

export default function WarpContext({ children }: { children: React.ReactNode }) {
    const { user } = useAuthenticator();
    if (!user) return null;
    return <UserNameProvider>{children}</UserNameProvider>;
}
