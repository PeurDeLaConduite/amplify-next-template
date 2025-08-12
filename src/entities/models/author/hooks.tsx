import { useState, useEffect, type ChangeEvent } from "react";
import { authorService } from "@entities/models/author/service";
import { type AuthorType, type AuthorFormType } from "@entities/models/author/types";
import { initialAuthorForm, toAuthorForm } from "@entities/models/author/form";

export function useAuthorForm(setMessage: (msg: string) => void) {
    const [authors, setAuthors] = useState<AuthorType[]>([]);
    const [form, setForm] = useState<AuthorFormType>({ ...initialAuthorForm });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // -------- Chargement initial --------
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await authorService.list();
        setAuthors(data ?? []);
        setLoading(false);
    };

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
                await authorService.create(authorInput);
                setMessage("Auteur ajouté !");
            } else {
                await authorService.update({ id: authors[editingIndex].id, ...authorInput });
                setMessage("Auteur mis à jour !");
            }
            await fetchData(); // Refresh list after change
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
            await fetchData(); // Refresh après suppression
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setMessage(`Erreur : ${msg}`);
        }
    };

    const modelForm = {
        authors,
        form,
        editingIndex,
        loading,
        handleFormChange,
        handleEdit,
        handleDelete,
        fetchData,
    };

    return { ...modelForm, submit, reset };
}
