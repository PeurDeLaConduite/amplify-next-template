import React from "react";
import "./globals.css";
import "@aws-amplify/ui-react/styles.css";
import Header from "@components/Header/Header";
import AuthProvider from "@components/Authentication/auth-provider";
import { UserNameContext } from "@context/userName/UserNameContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr-FR">
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                <AuthProvider>
                    <UserNameContext userName={{ userName }}>
                        <Header />
                        <main className="min-h-screen px-4 py-6 sm:px-8 sm:py-10  from-gray-100 via-white to-gray-50">
                            {children}
                        </main>
                    </UserNameContext>
                </AuthProvider>
            </body>
        </html>
    );
}
