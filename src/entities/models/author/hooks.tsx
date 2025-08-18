import { useCallback, useEffect } from "react";
import { useModelForm } from "@entities/core/hooks";
import { authorService } from "@entities/models/author/service";
import { initialAuthorForm, toAuthorForm } from "@entities/models/author/form";
import { type AuthorFormType, type AuthorType } from "@entities/models/author/types";

interface Extras extends Record<string, unknown> {
    authors: AuthorType[];
    loading: boolean;
}

export function useAuthorForm(author: AuthorType | null) {
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
            if (!author?.id) throw new Error("ID de l'auteur manquant pour la mise à jour");
            const { postIds, ...authorInput } = form;
            void postIds;
            const { data } = await authorService.update({
                id: author.id,
                ...authorInput,
            });
            if (!data) throw new Error("Erreur lors de la mise à jour de l'auteur");
            return data.id;
        },
    });

    const { setExtras, setForm, setMode } = modelForm;

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

    useEffect(() => {
        void fetchAuthors();
    }, [fetchAuthors]);

    useEffect(() => {
        if (author) {
            setForm(toAuthorForm(author, []));
            setMode("edit");
        } else {
            setForm(initialAuthorForm);
            setMode("create");
        }
    }, [author, setForm, setMode]);

    return { ...modelForm, fetchAuthors };
}
