// src/entities/models/author/hooks.tsx (ou où est ton hook)
import { useState, useEffect, useMemo, useCallback, type ChangeEvent } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { authorService as authorServiceFactory } from "@entities/models/author/service";
import type { AuthorType, AuthorFormType, } from "@entities/models/author/types";
import { initialAuthorForm, toAuthorForm } from "@entities/models/author/form";
import type { AuthUser } from "@entities/core/types";

export function useAuthorForm() {
    const { user } = useAuthenticator();

    // Map simple -> AuthUser (ajuste si tu as déjà un util pour récupérer les groups)
    const authUser = useMemo<AuthUser | null>(() => {
        if (!user) return null;
        return {
            username: (user as any)?.userId ?? (user as any)?.username,
            // groups: [...], // TODO: renseigner si tu veux que CREATE/UPDATE/DELETE passent les règles ADMINS
        };
    }, [user]);

    // Instancie le service avec l'utilisateur courant
    const authorService = useMemo(() => authorServiceFactory(authUser), [authUser]);

    const [authors, setAuthors] = useState<AuthorType[]>([]);
    const [form, setForm] = useState<AuthorFormType>({ ...initialAuthorForm });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);

    // -------- Chargement initial --------
    const fetchData = useCallback(async () => {
        setLoading(true);
        const { data } = await authorService.list();
        setAuthors(data ?? []);
        setLoading(false);
    }, [authorService]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    // --------- Handlers ---------
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
            const { postIds, ...authorInput } = form;
            void postIds;

            if (editingIndex === null) {
                await authorService.create(authorInput); // factory instanciée
                setMessage("Auteur ajouté !");
            } else {
                await authorService.update({ id: authors[editingIndex].id, ...authorInput });
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
            await authorService.delete({ id: authors[idx].id });
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
    };
}
