import {
    authorSchema,
    initialAuthorForm,
    toAuthorForm,
    toAuthorCreate,
    toAuthorUpdate,
} from "./form";
import { authorService } from "@entities/models/author/service";
import { type AuthorFormType, type AuthorType } from "@entities/models/author/types";

export type AuthorExtras = {
    authors: AuthorType[];
    loading: boolean;
};

export const authorConfig = {
    auth: "admin",
    identifier: "id",
    fields: ["authorName", "bio", "email", "avatar", "order"],
    relations: ["posts"],
    zodSchema: authorSchema,
    toForm: toAuthorForm,
    toCreate: toAuthorCreate,
    toUpdate: toAuthorUpdate,
    initialForm: initialAuthorForm,
    initialExtras: { authors: [], loading: true } as AuthorExtras,
    create: async (form: AuthorFormType) => {
        const { postIds, ...authorInput } = form;
        void postIds;
        const { data } = await authorService.create(authorInput);
        if (!data) throw new Error("Erreur lors de la création de l'auteur");
        return data.id;
    },
    update: async (form: AuthorFormType, author: AuthorType | null) => {
        if (!author?.id) throw new Error("ID auteur introuvable");
        const { postIds, ...authorInput } = form;
        void postIds;
        const { data } = await authorService.update({ id: author.id, ...authorInput });
        if (!data) throw new Error("Erreur lors de la mise à jour de l'auteur");
        return data.id;
    },
    loadExtras: async () => {
        const { data } = await authorService.list();
        return { authors: data ?? [], loading: false };
    },
    load: async (author: AuthorType) => toAuthorForm(author, []),
};
