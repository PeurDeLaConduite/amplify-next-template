import React from "react";
import { Amplify } from "aws-amplify";
import "./app.css";
import "./globals.css";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";
import Header from "@/src/components/Header/Header";
import AuthProvider from "@/src/components/Authentication/auth-provider";

Amplify.configure(outputs);

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
