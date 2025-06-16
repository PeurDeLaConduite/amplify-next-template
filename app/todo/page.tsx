"use client";

import React from "react";
import { Amplify } from "aws-amplify";
import CommentsPage from "./CommentsPage";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

export default function No() {
    return (
        <Authenticator>
            <CommentsPage />
        </Authenticator>
    );
}
