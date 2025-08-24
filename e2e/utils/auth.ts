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
    const { isSignedIn, nextStep } = await signIn({
        username: email!,
        password: password!,
    });

    if (!isSignedIn) {
        switch (nextStep.signInStep) {
            case "CONFIRM_SIGN_UP":
                throw new Error("Vérification de l'e-mail requise.");
            case "RESET_PASSWORD":
                throw new Error("Réinitialisation du mot de passe requise.");
            case "CONTINUE_SIGN_IN_WITH_MFA_SELECTION":
            case "CONTINUE_SIGN_IN_WITH_TOTP_SETUP":
            case "CONFIRM_SIGN_IN_WITH_TOTP_CODE":
                throw new Error("MFA requise pour la connexion.");
            default:
                throw new Error(`Étape de connexion non gérée : ${nextStep.signInStep}`);
        }
    }
};

export const signOutUser = async () => {
    await signOut({ global: true });
};
