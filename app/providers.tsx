// app/providers.tsx
"use client";
import { useEffect } from "react";
import { Amplify } from "aws-amplify";
import { amplifyConfig } from "@/src/app/amplifyConfig"; // <- voir patch #2

let configured = false;
export default function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (!configured) {
            Amplify.configure(amplifyConfig);
            console.log("[Amplify] configured =", Amplify.getConfig()); // <- DOIT montrer Auth.Cognito.oauth
            configured = true;
        }
    }, []);
    return <>{children}</>;
}
