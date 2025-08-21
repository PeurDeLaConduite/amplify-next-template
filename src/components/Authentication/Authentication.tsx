"use client";

import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { getCurrentUser, signIn, signUp } from "aws-amplify/auth";
import { configureI18n, formFields } from "@entities/core";
import { userNameService } from "@src/entities/models/userName";

// Configure i18n uniquement
configureI18n();

export default function Authentication() {
    const services = {
        async handleSignUp(formData: Parameters<typeof signUp>[0]) {
            return signUp(formData);
        },
        async handleSignIn(formData: Parameters<typeof signIn>[0]) {
            const result = await signIn(formData);
            try {
                const current = await getCurrentUser();
                const id = current.userId ?? (current as any).userSub;
                if (!id) throw new Error("userId manquant");
                const { data } = await userNameService.get({ id });
                if (!data) {
                    const userName = (formData as any).username ?? (formData as any).email;
                    await userNameService.create({ id, userName });
                }
            } catch (err) {
                console.error("Erreur création pseudo", err);
            }
            return result;
        },
    };
    return <Authenticator formFields={formFields} services={services} />;
}
