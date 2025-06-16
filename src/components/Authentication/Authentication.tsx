"use client";

import React from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";
import { configureI18n, formFields } from "@/src/utils/amplifyUiConfig";

// Configure AWS Amplify et i18n
Amplify.configure(outputs);
configureI18n();

export default function Authentication() {
    return <Authenticator formFields={formFields} />;
}
