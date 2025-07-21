"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import RequireAdmin from "@components/RequireAdmin";
// import UserNameManager from "@components/Profile/UserNameManager";

Amplify.configure(outputs);

export default function AdminUserNamesPage() {
    return (
        <RequireAdmin>
            <div className="p-6 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Gestion des pseudos</h1>
                {/* <UserNameManager /> */}
            </div>
        </RequireAdmin>
    );
}
