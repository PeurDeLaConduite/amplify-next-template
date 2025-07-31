import { useState, type ChangeEvent } from "react";
import { useAuthors } from "@/src/services/useAuthors";
import { omitId } from "@/src/utils/omitId";
import type { Author, AuthorOmit } from "@/src/types";

export function useAuthorForm(authors: Author[], setMessage: (msg: string) => void) {
    const { create, update, delete: remove } = useAuthors();
    const initialForm: AuthorOmit = { name: "", avatar: "", bio: "", email: "" };
    const [form, setForm] = useState<AuthorOmit>(initialForm);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleEdit = (idx: number) => {
        setEditingIndex(idx);
        const a = authors[idx];
        setForm({
            name: a.name ?? "",
            avatar: a.avatar ?? "",
            bio: a.bio ?? "",
            email: a.email ?? "",
        });
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setForm(initialForm);
    };

    const handleSave = async () => {
        if (!form.name) return;
        try {
            if (editingIndex === null) {
                await create(form);
                setMessage("Auteur ajouté !");
            } else {
                await update(authors[editingIndex].id, omitId(form));
                setMessage("Auteur mis à jour !");
            }
            handleCancel();
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setMessage(`Erreur : ${msg}`);
        }
    };

    const handleDelete = async (idx: number) => {
        if (!authors[idx]?.id) return;
        if (!window.confirm("Supprimer cet auteur ?")) return;
        try {
            await remove(authors[idx].id);
            setMessage("Auteur supprimé !");
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setMessage(`Erreur : ${msg}`);
        }
    };

    return { form, editingIndex, handleChange, handleEdit, handleCancel, handleSave, handleDelete };
}
