"use client";

import React from "react";
import { Amplify } from "aws-amplify";
// import CommentsPage from "./CommentsPage";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";
import AuthProvider from "@/src/components/Authentication/auth-provider";

Amplify.configure(outputs);

export default function No() {
    return (
        <AuthProvider>
            {/* <CommentsPage /> */}
            <></>
        </AuthProvider>
    );
}
