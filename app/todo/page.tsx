"use client";

import React from "react";
import CommentsPage from "./CommentsPage";
import "@aws-amplify/ui-react/styles.css";
import AuthProvider from "@/src/components/Authentication/auth-provider";

export default function No() {
    return (
        <AuthProvider>
            <CommentsPage />
            <></>
        </AuthProvider>
    );
}
