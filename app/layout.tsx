import React from "react";
import "./globals.css";
import "@aws-amplify/ui-react/styles.css";
import Header from "@components/Header/Header";
import Providers from "./providers";
import AuthProvider from "@components/Authentication/auth-provider";
export const metadata = {
    // prod: remplace par ton vrai domaine
    metadataBase: new URL(
        process.env.NODE_ENV === "production"
            ? "https://peur-de-la-conduite.fr"
            : "http://localhost:3000"
    ),
    title: "Peur de la conduite",
    description: "—",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr-FR">
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                <Providers>
                    <AuthProvider>
                        <Header />
                        <main className="min-h-screen px-4 py-6 sm:px-8 sm:py-10  from-gray-100 via-white to-gray-50">
                            {children}
                        </main>
                    </AuthProvider>
                </Providers>
            </body>
        </html>
    );
}
