"use client";

import React from "react";
import { Amplify } from "aws-amplify";
import "./app.css";
import "./globals.css";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <main className="">{children}</main>
            </body>
        </html>
    );
}
