"use client";

import React from "react";
import { Amplify } from "aws-amplify";
import CommentsPage from "./CommentsPage";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

export default function No() {
    return (
            <CommentsPage />
    );
}
