import { useState, type ChangeEvent } from "react";
import { useAuthors } from "@/src/services/useAuthors";
import type { Author, AuthorOmit, AuthorUpdateInput, AuthorForm } from "@/src/types/";
import { initialAuthorForm } from "@/src/utils/modelForm";

export function useAuthorForm(authors: Author[], setMessage: (msg: string) => void) {
    const { create, update, delete: remove } = useAuthors();
    const [form, setForm] = useState<AuthorForm>({ ...initialAuthorForm });
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
            postIds: [],
        });
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setForm({ ...initialAuthorForm });
    };

    const handleSave = async () => {
        if (!form.name) return;
        try {
            const { postIds, ...authorInput } = form;
            void postIds;
            const input = { ...authorInput, posts: [] };
            if (editingIndex === null) {
                await create(input as unknown as AuthorOmit);
                setMessage("Auteur ajouté !");
            } else {
                await update(authors[editingIndex].id, input as unknown as AuthorUpdateInput);
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
