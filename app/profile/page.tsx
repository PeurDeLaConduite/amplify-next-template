"use client";

import "@aws-amplify/ui-react/styles.css";
import ProfileForm from "@components/Profile/ProfileManager";
import UserNameManager from "@components/Profile/UserNameManager";
import AuthProvider from "@components/Authentication/auth-provider";

export default function ConnectionPage() {
    return (
        <AuthProvider>
            <UserNameManager />
            {/* <ProfileForm /> */}
        </AuthProvider>
    );
}
