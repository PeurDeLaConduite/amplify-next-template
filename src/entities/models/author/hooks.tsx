// src/entities/models/author/hooks.tsx
import { useEffect, useRef, useCallback, type ChangeEvent } from "react";
import { useModelForm } from "@entities/core/hooks";
import { authorService } from "@entities/models/author/service";
import { initialAuthorForm, toAuthorForm } from "@entities/models/author/form";
import { type AuthorFormType, type AuthorType } from "@entities/models/author/types";

interface Extras extends Record<string, unknown> {
    authors: AuthorType[];
    loading: boolean;
}

export function useAuthorForm() {
    const editingIndex = useRef<number | null>(null);
    const authorsRef = useRef<AuthorType[]>([]);

    const modelForm = useModelForm<AuthorFormType, Extras>({
        initialForm: initialAuthorForm,
        initialExtras: { authors: [], loading: true },
        create: async (form) => {
            const { postIds, ...authorInput } = form;
            void postIds;
            const { data } = await authorService.create(authorInput);
            if (!data) throw new Error("Erreur lors de la création de l'auteur");
            return data.id;
        },
        update: async (form) => {
            if (editingIndex.current === null) {
                throw new Error("Auteur à mettre à jour non sélectionné");
            }
            const id = authorsRef.current[editingIndex.current]?.id;
            if (!id) throw new Error("ID auteur introuvable");
            const { postIds, ...authorInput } = form;
            void postIds;
            const { data } = await authorService.update({ id, ...authorInput });
            if (!data) throw new Error("Erreur lors de la mise à jour de l'auteur");
            return data.id;
        },
    });

    const { setForm, setExtras, setMode, setMessage, submit, reset, handleChange } = modelForm;

    const fetchAuthors = useCallback(async () => {
        setExtras((prev) => ({ ...prev, loading: true }));
        const { data } = await authorService.list();
        authorsRef.current = data ?? [];
        setExtras({ authors: authorsRef.current, loading: false });
    }, [setExtras]);

    useEffect(() => {
        void fetchAuthors();
    }, [fetchAuthors]);

    const handleEdit = (idx: number) => {
        const author = authorsRef.current[idx];
        if (!author) return;
        editingIndex.current = idx;
        setForm(toAuthorForm(author, []));
        setMode("edit");
    };

    const handleDelete = async (idx: number) => {
        const author = authorsRef.current[idx];
        if (!author?.id) return;
        if (!window.confirm("Supprimer cet auteur ?")) return;
        try {
            await authorService.delete({ id: author.id });
            await fetchAuthors();
            setMessage("Auteur supprimé !");
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setMessage(`Erreur : ${msg}`);
        }
    };

    async function submitForm() {
        try {
            await submit();
            await fetchAuthors();
            setMessage(editingIndex.current === null ? "Auteur ajouté !" : "Auteur mis à jour !");
            resetForm();
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setMessage(`Erreur : ${msg}`);
        }
    }

    function resetForm() {
        editingIndex.current = null;
        setMode("create");
        reset();
    }

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        handleChange(name as keyof AuthorFormType, value as never);
    };

    return {
        ...modelForm,
        authors: modelForm.extras.authors,
        loading: modelForm.extras.loading,
        editingIndex: editingIndex.current,
        handleEdit,
        handleDelete,
        handleFormChange,
        submit: submitForm,
        reset: resetForm,
    };
}
