import { useState, type ChangeEvent } from "react";
import { authorService, Author, AuthorForm } from "@src/entities";
import { initialAuthorForm, toAuthorForm } from "@/src/utils/modelForm";

export function useAuthorForm(authors: Author[], setMessage: (msg: string) => void) {
    const [form, setForm] = useState<AuthorForm>({ ...initialAuthorForm });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleEdit = (idx: number) => {
        setEditingIndex(idx);
        const a = authors[idx];
        setForm(toAuthorForm(a, []));
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
            if (editingIndex === null) {
                await authorService.create(authorInput);
                setMessage("Auteur ajouté !");
            } else {
                await authorService.update({ id: authors[editingIndex].id, ...authorInput });
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
            await authorService.delete({ id: authors[idx].id });
            setMessage("Auteur supprimé !");
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setMessage(`Erreur : ${msg}`);
        }
    };

    return { form, editingIndex, handleChange, handleEdit, handleCancel, handleSave, handleDelete };
}
