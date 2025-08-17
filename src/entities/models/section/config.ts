import {
    sectionSchema,
    initialSectionForm,
    toSectionForm,
    toSectionCreate,
    toSectionUpdate,
} from "./form";
import { sectionService } from "@entities/models/section/service";
import { postService } from "@entities/models/post/service";
import { sectionPostService } from "@entities/relations/sectionPost/service";
import { syncManyToMany } from "@entities/core/utils/syncManyToMany";
import { type SectionFormTypes, type SectionTypes } from "@entities/models/section/types";
import { type PostType } from "@entities/models/post/types";

export type SectionExtras = {
    posts: PostType[];
    sections: SectionTypes[];
};

export const sectionConfig = {
    auth: "admin",
    identifier: "id",
    fields: ["slug", "title", "description", "order", "seo"],
    relations: ["posts"],
    zodSchema: sectionSchema,
    toForm: toSectionForm,
    toCreate: toSectionCreate,
    toUpdate: toSectionUpdate,
    initialForm: initialSectionForm,
    initialExtras: { posts: [], sections: [] } as SectionExtras,
    create: async (form: SectionFormTypes) => {
        const { postIds, ...sectionInput } = form;
        void postIds;
        const { data } = await sectionService.create(sectionInput);
        if (!data) throw new Error("Erreur lors de la création de la section");
        return data.id;
    },
    update: async (form: SectionFormTypes, section: SectionTypes | null) => {
        if (!section?.id) {
            throw new Error("ID de la section manquant pour la mise à jour");
        }
        const { postIds, ...sectionInput } = form;
        void postIds;
        const { data } = await sectionService.update({
            id: section.id,
            ...sectionInput,
        });
        if (!data) throw new Error("Erreur lors de la mise à jour de la section");
        return data.id;
    },
    syncRelations: async (id: string, form: SectionFormTypes) => {
        const currentPostIds = await sectionPostService.listByParent(id);
        await syncManyToMany(
            currentPostIds,
            form.postIds,
            (postId) => sectionPostService.create(id, postId),
            (postId) => sectionPostService.delete(id, postId)
        );
    },
    loadExtras: async () => {
        const [p, s] = await Promise.all([postService.list(), sectionService.list()]);
        return {
            posts: p.data ?? [],
            sections: s.data ?? [],
        };
    },
    load: async (section: SectionTypes) => {
        const postIds = await sectionPostService.listByParent(section.id);
        return toSectionForm(section, postIds);
    },
};
