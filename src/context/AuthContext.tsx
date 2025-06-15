"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

type AuthContextType = {
    isLoggedIn: boolean;
    firstName: string;
    familyName: string;
    logout: () => void;
    refreshProfile: () => void;
    globalLogout: (signOut?: () => void) => void;
    signOutAmplify?: () => void;
    setSignOutAmplify: (signOutFn: () => void) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthIsConnected = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [signOutAmplify, setSignOutAmplify] = useState<() => void>();

    const [firstName, setFirstName] = useState("");
    const [familyName, setFamilyName] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const globalLogout = (signOut?: () => void) => {
        Cookies.remove("userProfile");
        setIsLoggedIn(false);
        setFirstName("");
        setFamilyName("");
        if (signOut) signOut(); // déconnexion Amplify
    };
    const loadProfile = () => {
        const cookieProfile = Cookies.get("userProfile");
        if (cookieProfile) {
            try {
                const parsed = JSON.parse(cookieProfile);
                setFirstName(parsed.firstName || "");
                setFamilyName(parsed.familyName || "");
                setIsLoggedIn(true);
            } catch {
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    };

    const logout = () => {
        Cookies.remove("userProfile");
        setIsLoggedIn(false);
        setFirstName("");
        setFamilyName("");
    };

    useEffect(() => {
        loadProfile();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                firstName,
                familyName,
                logout,
                refreshProfile: loadProfile,
                globalLogout: (signOut?: () => void) => {
                    Cookies.remove("userProfile");
                    setIsLoggedIn(false);
                    setFirstName("");
                    setFamilyName("");
                    if (signOut) signOut();
                    else if (signOutAmplify) signOutAmplify(); // fallback global
                },
                signOutAmplify,
                setSignOutAmplify,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthIsConnected");
    return context;
};
