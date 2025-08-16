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
            if (editingIndex.current === null)
                throw new Error("Auteur à mettre à jour non sélectionné");
            const id = authorsRef.current[editingIndex.current]?.id;
            if (!id) throw new Error("ID auteur introuvable");
            const { postIds, ...authorInput } = form;
            void postIds;
            const { data } = await authorService.update({ id, ...authorInput });
            if (!data) throw new Error("Erreur lors de la mise à jour de l'auteur");
            return data.id;
        },
    });

    const { setExtras, adoptInitial, setMessage } = modelForm;

    const fetchAuthors = useCallback(async () => {
        setExtras((prev) => ({ ...prev, loading: true })); // conserve d’éventuels champs futurs
        try {
            const { data } = await authorService.list();
            authorsRef.current = data ?? [];
            setExtras((prev) => ({ ...prev, authors: authorsRef.current, loading: false }));
        } catch {
            setExtras((prev) => ({ ...prev, loading: false }));
        }
    }, [setExtras]);

    useEffect(() => {
        void fetchAuthors();
    }, [fetchAuthors]);

    const edit = (idx: number) => {
        const author = authorsRef.current[idx];
        if (!author) return;
        editingIndex.current = idx;
        // ⬇️ baseline = form dérivé + mode edit
        adoptInitial(toAuthorForm(author, []), "edit");
    };

    const remove = async (idx: number) => {
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
            await modelForm.submit();
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
        // ⬇️ baseline = formulaire vide + mode create (au lieu de reset() qui repart sur la baseline courante)
        adoptInitial(initialAuthorForm, "create");
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        modelForm.handleChange(name as keyof AuthorFormType, value as never);
    };

    return {
        ...modelForm,
        editingIndex: editingIndex.current,
        handleChange,
        edit,
        remove,
        submit: submitForm,
        reset: resetForm,
    };
}
