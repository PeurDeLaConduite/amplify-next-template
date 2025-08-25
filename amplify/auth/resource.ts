import { defineAuth } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 * 
 *             export const auth = defineAuth({
                loginWith: {
                    email: true,
                    // ou phone: true si besoin
                    externalProviders: {
                        callbackUrls: [
                            "https://peur-de-la-conduite.fr/auth/callback",
                            "https://desktop.peur-de-la-conduite.fr/auth/callback",
                            "https://mobile.peur-de-la-conduite.fr/auth/callback",
                        ],
                        logoutUrls: [
                            "https://peur-de-la-conduite.fr/auth/callback",
                            "https://desktop.peur-de-la-conduite.fr/auth/callback",
                            "https://mobile.peur-de-la-conduite.fr/auth/callback",
                        ],
                    },
                },
            });

 * 
 */

export const auth = defineAuth({
    loginWith: {
        email: true,
        // ou phone: true si besoin
    },
});
/* 

 */