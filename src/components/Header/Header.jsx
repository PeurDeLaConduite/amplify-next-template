"use client";

import React from "react";
import Link from "next/link";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { PowerButton } from "@src/components/buttons";
import { useUserNameManager } from "@src/entities"; // <-- le hook générique qu'on vient de créer
import UserNameModal from "@src/components/Profile/UserNameModal";

const Header = () => {
    const { user, signOut } = useAuthenticator();
    const {
        formData: { userName },
        loading,
        fetchData,
    } = useUserNameManager();
    const [showModal, setShowModal] = React.useState(false);

    React.useEffect(() => {
        // Optionnel : fetch userName à l’ouverture du Header ou quand user change
        fetchData();
    }, [user, fetchData]);

    React.useEffect(() => {
        if (user && !userName) {
            setShowModal(true);
        }
        if (userName) {
            setShowModal(false);
        }
    }, [user, userName]);

    return (
        <>
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
                                    <PowerButton
                                        onClick={signOut}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                    >
                                        Se déconnecter
                                    </PowerButton>
                                </>
                            ) : (
                                <>
                                    <span className="text-sm text-gray-400">
                                        {loading ? "Chargement..." : "Aucun pseudo"}
                                    </span>
                                    <PowerButton
                                        onClick={signOut}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                    >
                                        Se déconnecter
                                    </PowerButton>
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
            <UserNameModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
};

export default Header;
