// src/components/layout/Header.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { PowerButton } from "@src/components/buttons";
import { useUserNameForm } from "@entities/models/userName/hooks";
import UserNameModal from "@src/components/Profile/UserNameModal";
import { onUserNameUpdated } from "@entities/models/userName/bus";
import type { UserNameType } from "@entities/models/userName";
interface HeaderProps {
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
    const { user, signOut } = useAuthenticator();
    const [editingProfile] = useState<UserNameType | null>(null);
    const {
        form: { userName },
        refresh,
    } = useUserNameForm(editingProfile); // ✅ sans argument

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (user) void refresh();
        else setShowModal(false);
    }, [user, refresh]);

    useEffect(() => {
        if (!user) return;
        const unsub = onUserNameUpdated(() => {
            void refresh();
        });
        return unsub;
    }, [user, refresh]);

    useEffect(() => {
        if (user && !userName) setShowModal(true);
        if (userName) setShowModal(false);
    }, [user, userName]);

    return (
        <>
            <header className={`bg-white shadow-md ${className ?? ""}`}>
                <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
                    <div className="flex gap-6">
                        <Link href="/todo" className="text-gray-700 hover:text-blue-600">
                            Todo
                        </Link>
                        <Link href="/createAuthor" className="text-gray-700 hover:text-blue-600">
                            Create Author
                        </Link>
                        <Link href="/createSection" className="text-gray-700 hover:text-blue-600">
                            Create Section
                        </Link>
                        <Link href="/createTag" className="text-gray-700 hover:text-blue-600">
                            Create Tag
                        </Link>
                        <Link href="/createArticle" className="text-gray-700 hover:text-blue-600">
                            Create Article
                        </Link>
                        <Link href="/blog" className="text-gray-700 hover:text-blue-600">
                            Blog
                        </Link>
                        <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                            My profile
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            userName ? (
                                <>
                                    <p className="text-sm text-gray-700">
                                        Connecté en tant que : <strong>{userName}</strong>
                                    </p>
                                    <PowerButton
                                        onClick={signOut}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                    />
                                </>
                            ) : (
                                <>
                                    <span className="text-sm text-gray-400">Aucun pseudo</span>
                                    <PowerButton
                                        onClick={signOut}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                    />
                                </>
                            )
                        ) : (
                            <Link href="/connection" className="text-gray-700 hover:text-blue-600">
                                Connexion
                            </Link>
                        )}
                    </div>
                </nav>
            </header>

            <UserNameModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
};

export default Header;
