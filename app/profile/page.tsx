"use client";

import "@aws-amplify/ui-react/styles.css";
import ProfileForm from "@/src/components/Profile/UserProfileManager";
import UserNameManager from "@components/Profile/UserNameManager";
import AuthProvider from "@components/Authentication/auth-provider";

export default function ConnectionPage() {
    return (
        <AuthProvider>
            <UserNameManager />
            <ProfileForm />
        </AuthProvider>
    );
}
