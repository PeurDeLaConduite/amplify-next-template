import { useEffect, useState } from "react";
import { useEntityManager, type FieldConfig } from "@entities/core/hooks";
import { postService } from "@entities/models/post/service";
import { authorService } from "@entities/models/author/service";
import { tagService } from "@entities/models/tag/service";
import { sectionService } from "@entities/models/section/service";
import { postTagService } from "@entities/relations/postTag/service";
import { sectionPostService } from "@entities/relations/sectionPost/service";
import {
    initialPostForm,
    toPostForm,
    toPostCreate,
    toPostUpdate,
} from "@entities/models/post/form";
import type { PostFormType } from "@entities/models/post/types";
import type { AuthorType } from "@entities/models/author/types";
import type { TagType } from "@entities/models/tag/types";
import type { SectionTypes } from "@entities/models/section/types";
import { syncManyToMany } from "@entities/core/utils/syncManyToMany";

export function usePostForm(id?: string) {
    const [authors, setAuthors] = useState<AuthorType[]>([]);
    const [tags, setTags] = useState<TagType[]>([]);
    const [sections, setSections] = useState<SectionTypes[]>([]);

    useEffect(() => {
        authorService.list().then(({ data }) => setAuthors(data ?? []));
        tagService.list().then(({ data }) => setTags(data ?? []));
        sectionService.list().then(({ data }) => setSections(data ?? []));
    }, []);

    const fieldConfig: FieldConfig<PostFormType> = Object.keys(initialPostForm).reduce(
        (acc, key) => ({
            ...acc,
            [key]: {
                parse: (v) => v as PostFormType[keyof PostFormType],
                serialize: (v) => v as unknown,
                emptyValue: initialPostForm[key as keyof PostFormType],
            },
        }),
        {} as FieldConfig<PostFormType>
    );

    const fetch = async () => {
        if (!id) return null;
        const { data } = await postService.get({ id });
        if (!data) return null;
        const [tagIds, sectionIds] = await Promise.all([
            postTagService.listByParent(id),
            sectionPostService.listByChild(id),
        ]);
        return { id, ...toPostForm(data, tagIds, sectionIds) };
    };

    const create = async (form: PostFormType) => {
        const { data } = await postService.create(toPostCreate(form));
        if (data) {
            await syncManyToMany(
                [],
                form.tagIds,
                (tagId) => postTagService.create(data.id, tagId),
                () => Promise.resolve()
            );
            await syncManyToMany(
                [],
                form.sectionIds,
                (sectionId) => sectionPostService.create(sectionId, data.id),
                () => Promise.resolve()
            );
        }
    };

    const update = async (entity: (PostFormType & { id?: string }) | null, form: PostFormType) => {
        if (!entity?.id) return;
        await postService.update({ id: entity.id, ...toPostUpdate(form) });
        await syncManyToMany(
            await postTagService.listByParent(entity.id),
            form.tagIds,
            (tagId) => postTagService.create(entity.id!, tagId),
            (tagId) => postTagService.delete(entity.id!, tagId)
        );
        await syncManyToMany(
            await sectionPostService.listByChild(entity.id),
            form.sectionIds,
            (sectionId) => sectionPostService.create(sectionId, entity.id!),
            (sectionId) => sectionPostService.delete(sectionId, entity.id!)
        );
    };

    const remove = async (entity: (PostFormType & { id?: string }) | null) => {
        if (!entity?.id) return;
        await postService.delete({ id: entity.id });
    };

    const manager = useEntityManager<PostFormType>({
        fetch,
        create,
        update,
        remove,
        labels: (f) => f,
        fields: Object.keys(initialPostForm) as (keyof PostFormType)[],
        initialData: initialPostForm,
        config: fieldConfig,
    });

    return {
        form: manager.formData,
        authors,
        tags,
        sections,
        loading: manager.loading,
        save: manager.save,
        delete: manager.deleteEntity,
    };
}
