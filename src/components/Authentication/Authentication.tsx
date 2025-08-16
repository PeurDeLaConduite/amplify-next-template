"use client";

import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { signUp } from "aws-amplify/auth";
import { configureI18n, formFields } from "@entities/core";
import { userNameService } from "@src/entities/models/userName";

// Configure i18n uniquement
configureI18n();

export default function Authentication() {
    const services = {
        async handleSignUp(formData: Parameters<typeof signUp>[0]) {
            const result = await signUp(formData);
            try {
                await userNameService.create({
                    id: result.userId,
                    userName: formData.username,
                });
            } catch (err) {
                console.error("Erreur création pseudo", err);
            }
            return result;
        },
    };
    return <Authenticator formFields={formFields} services={services} />;
}
