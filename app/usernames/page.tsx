"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import UserNameManager from "@components/Profile/UserNameManager";
import AuthProvider from "@components/Authentication/auth-provider";
Amplify.configure(outputs);

export default function AdminUserNamesPage() {
    return (
        <AuthProvider>
            <UserNameManager />
        </AuthProvider>
    );
}
