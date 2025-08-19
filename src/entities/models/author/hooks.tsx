import { useCallback, useEffect, useState } from "react";
import { useModelForm } from "@entities/core/hooks";
import { authorService } from "@entities/models/author/service";
import { initialAuthorForm, toAuthorForm } from "@entities/models/author/form";
import { type AuthorFormType, type AuthorType } from "@entities/models/author/types";

interface Extras extends Record<string, unknown> {
    authors: AuthorType[];
    loading: boolean;
}

export function useAuthorForm(author: AuthorType | null) {
    const [editingId, setEditingId] = useState<string | null>(author?.id ?? null);

    const modelForm = useModelForm<AuthorFormType, Extras>({
        initialForm: initialAuthorForm,
        initialExtras: { authors: [], loading: true },
        create: async (form) => {
            const { postIds, ...authorInput } = form;
            void postIds;
            const { data } = await authorService.create(authorInput);
            if (!data) throw new Error("Erreur lors de la création de l'auteur");
            setEditingId(data.id);
            return data.id;
        },
        update: async (form) => {
            if (!editingId) throw new Error("ID de l'auteur manquant pour la mise à jour");
            const { postIds, ...authorInput } = form;
            void postIds;
            const { data } = await authorService.update({
                id: editingId,
                ...authorInput,
            });
            if (!data) throw new Error("Erreur lors de la mise à jour de l'auteur");
            setEditingId(data.id);
            return data.id;
        },
    });

    const { setExtras, setForm, setMode, extras, reset } = modelForm;

    const fetchAuthors = useCallback(async () => {
        setExtras((prev) => ({ ...prev, loading: true }));
        try {
            const { data } = await authorService.list();
            setExtras((prev) => ({
                ...prev,
                authors: data ?? [],
                loading: false,
            }));
        } catch {
            setExtras((prev) => ({ ...prev, loading: false }));
        }
    }, [setExtras]);

    const selectById = useCallback(
        (id: string) => {
            const authorItem = extras.authors.find((a) => a.id === id) ?? null;
            if (authorItem) {
                setForm(toAuthorForm(authorItem, []));
                setMode("edit");
                setEditingId(id);
            }
            return authorItem;
        },
        [extras.authors, setForm, setMode]
    );

    const removeById = useCallback(
        async (id: string) => {
            if (!window.confirm("Supprimer cet auteur ?")) return;
            await authorService.deleteCascade({ id });
            await fetchAuthors();
            if (editingId === id) {
                setEditingId(null);
                reset();
            }
        },
        [fetchAuthors, editingId, reset]
    );

    useEffect(() => {
        void fetchAuthors();
    }, [fetchAuthors]);

    useEffect(() => {
        if (author) {
            setForm(toAuthorForm(author, []));
            setMode("edit");
            setEditingId(author.id);
        } else {
            setForm(initialAuthorForm);
            setMode("create");
            setEditingId(null);
        }
    }, [author, setForm, setMode]);

    return { ...modelForm, editingId, fetchAuthors, selectById, removeById };
}
