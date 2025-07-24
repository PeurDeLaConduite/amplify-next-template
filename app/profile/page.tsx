"use client";

import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "../../amplify_outputs.json";
import ProfileForm from "@components/Profile/ProfileManager";
import UserNameManager from "@components/Profile/UserNameManager";
import AuthProvider from "@components/Authentication/auth-provider";
Amplify.configure(outputs);

export default function ConnectionPage() {
    return (
        <AuthProvider>
            <UserNameManager />
            <ProfileForm />
        </AuthProvider>
    );
}
