"use client";

import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { configureI18n, formFields } from "@utils/amplifyUiConfig";

// Configure i18n uniquement
configureI18n();

export default function Authentication() {
    return <Authenticator formFields={formFields} />;
}
