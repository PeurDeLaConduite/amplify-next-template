// src/entities/models/author/hooks.tsx
"use client";

import { useState, useEffect, useMemo, useCallback, type ChangeEvent } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { AuthorType, AuthorFormType } from "@entities/models/author/types";
import { initialAuthorForm, toAuthorForm } from "@entities/models/author/form";
import type { AuthUser } from "@entities/core/types";
import { extractGroups } from "@entities/core/auth"; // ← util sans any
import { authorService as authorServiceFactory } from "@entities/models/author/service";
export function useAuthorForm() {
    const { user } = useAuthenticator();

    // Map Amplify user -> AuthUser (username + groups)
    const authUser = useMemo<AuthUser | null>(() => {
        if (!user) return null;

        const username =
            (user as unknown as { userId?: string })?.userId ??
            (user as unknown as { username?: string })?.username ??
            undefined;
        return { username, groups: extractGroups(user) };
    }, [user]);

    // Service instancié avec l'utilisateur courant
    const svc = useMemo(() => authorServiceFactory(authUser), [authUser]);

    const [authors, setAuthors] = useState<AuthorType[]>([]);
    const [form, setForm] = useState<AuthorFormType>({ ...initialAuthorForm });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);

    const isAdmin = authUser?.groups?.includes("ADMINS") ?? false;

    // Chargement initial / refresh
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await svc.list();
            setAuthors(data ?? []);
        } finally {
            setLoading(false);
        }
    }, [svc]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    // Handlers
    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleEdit = (idx: number) => {
        setEditingIndex(idx);
        setForm(toAuthorForm(authors[idx], []));
    };

    function reset() {
        setEditingIndex(null);
        setForm({ ...initialAuthorForm });
    }

    async function submit() {
        if (!form.authorName) return;
        try {
            if (!isAdmin) {
                setMessage("Action interdite : réservé au groupe ADMINS.");
                return;
            }
            const { postIds, ...authorInput } = form; // postIds géré à part via relations
            void postIds;

            if (editingIndex === null) {
                await svc.create(authorInput);
                setMessage("Auteur ajouté !");
            } else {
                await svc.update({ id: authors[editingIndex].id, ...authorInput });
                setMessage("Auteur mis à jour !");
            }

            await fetchData();
            reset();
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setMessage(`Erreur : ${msg}`);
        }
    }

    const handleDelete = async (idx: number) => {
        if (!authors[idx]?.id) return;
        if (!window.confirm("Supprimer cet auteur ?")) return;
        try {
            if (!isAdmin) {
                setMessage("Action interdite : réservé au groupe ADMINS.");
                return;
            }
            await svc.delete({ id: authors[idx].id });
            setMessage("Auteur supprimé !");
            await fetchData();
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setMessage(`Erreur : ${msg}`);
        }
    };

    return {
        authors,
        form,
        editingIndex,
        loading,
        handleFormChange,
        handleEdit,
        handleDelete,
        fetchData,
        submit,
        reset,
        message,
        setMessage,
        isAdmin,
    };
}
