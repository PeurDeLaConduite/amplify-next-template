// app/providers.tsx
"use client";

// src/amplifyConfig.ts
export const amplifyConfig = {
    Auth: {
        Cognito: {
            userPoolId: "eu-west-3_cVrLIne9H",
            userPoolClientId: "5i8l89k5muqtfpb3v2l53h2noe",
            loginWith: { email: true, username: false, phone: false },
            oauth: {
                domain: "auth.peur-de-la-conduite.fr", // ton domaine Cognito (custom actif)
                redirectSignIn: [
                    "http://localhost:3000/", // dev
                    "https://connexion.peur-de-la-conduite.fr/",
                    "https://desktop.peur-de-la-conduite.fr/auth/callback",
                    "https://mobile.peur-de-la-conduite.fr/auth/callback",
                    "https://peur-de-la-conduite.fr/auth/callback",
                    "https://n8d3v4q7m6z1k9x2c5t7r4p6j8h3f1l9b2g7y4w6q3m8z5x1n7k4v9c2d5r8p1j.peur-de-la-conduite.fr/",
                ],
                redirectSignOut: [
                    "http://localhost:3000/",
                    "https://connexion.peur-de-la-conduite.fr/",
                    "https://desktop.peur-de-la-conduite.fr/auth/callback",
                    "https://mobile.peur-de-la-conduite.fr/auth/callback",
                    "https://peur-de-la-conduite.fr/auth/callback",
                    "https://n8d3v4q7m6z1k9x2c5t7r4p6j8h3f1l9b2g7y4w6q3m8z5x1n7k4v9c2d5r8p1j.peur-de-la-conduite.fr/",
                ],
                responseType: "code",
                scopes: ["openid", "email", "profile"],
            },
        },
    },
    API: {
        GraphQL: {
            endpoint: "https://api.peur-de-la-conduite.fr/graphql",
            region: "eu-west-3",
            defaultAuthMode: "userPool",
            apiKey: "da2-5q3c6url4fhohhudpw3urggfze",
            additionalAuthModes: ["apiKey"],
        },
    },
} as const;
