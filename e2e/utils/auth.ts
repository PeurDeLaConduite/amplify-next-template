import { signIn, signOut } from "@aws-amplify/auth";
import { test } from "playwright/test";

export const email = process.env.E2E_USER_EMAIL;
export const password = process.env.E2E_USER_PASSWORD;

export const requireCredentials = () => {
    if (!email || !password) {
        test.skip(true, "Identifiants E2E manquants");
    }
};

export const signInUser = async () => {
    requireCredentials();
    await signIn({ username: email!, password: password! });
};

export const signOutUser = async () => {
    await signOut();
};
