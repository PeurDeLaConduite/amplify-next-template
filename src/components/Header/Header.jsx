"use client";

import React from "react";
import Link from "next/link";
import { useUserName } from "@src/entities";
import { PowerButton } from "../buttons/Buttons";
import { useAuthenticator } from "@aws-amplify/ui-react";

const Header = () => {
    const { user, signOut } = useAuthenticator();
    const { userName } = useUserName();
    return (
        <header className="bg-white shadow-md">
            <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
                <div className="flex gap-6">
                    {/* <Link href="/comment" className="text-gray-700 hover:text-blue-600">
                        Commentaires
                    </Link>

                    <Link href="/" className="text-gray-700 hover:text-blue-600">
                        Home
                    </Link>
                    <Link href="/uploadPage" className="text-gray-700 hover:text-blue-600">
                        Upload Page
                    </Link> */}
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
                    </Link>{" "}
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
                                <Link
                                    href="/connection"
                                    className="text-gray-700 hover:text-blue-600"
                                >
                                    <PowerButton
                                        onClick={signOut}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                    >
                                        Se déconnecter
                                    </PowerButton>
                                </Link>
                            </>
                        ) : (
                            <>
                                <span className="text-sm text-gray-400">Chargement...</span>{" "}
                                <PowerButton
                                    onClick={signOut}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                >
                                    Se déconnecter
                                </PowerButton>{" "}
                            </>
                        )
                    ) : (
                        <Link href="/connection" className="text-gray-700 hover:text-blue-600">
                            Connection
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
