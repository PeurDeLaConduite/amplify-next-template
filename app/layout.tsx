import React from "react";
import "./globals.css";
import "@aws-amplify/ui-react/styles.css";
import Header from "@/src/components/Header/Header";
import AuthProvider from "@/src/components/Authentication/auth-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr-FR">
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                <AuthProvider>
                    {/* <AuthIsConnected> */}
                    <Header />
                    {/* </AuthIsConnected> */}
                    <main className="min-h-screen px-4 py-6 sm:px-8 sm:py-10  from-gray-100 via-white to-gray-50">
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}
