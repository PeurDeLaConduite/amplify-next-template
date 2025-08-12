import { useEffect, useState } from "react";
import { useEntityManager, type FieldConfig } from "@entities/core/hooks";
import { sectionService } from "@entities/models/section/service";
import { postService } from "@entities/models/post/service";
import { sectionPostService } from "@entities/relations/sectionPost/service";
import {
    initialSectionForm,
    toSectionForm,
    toSectionCreate,
    toSectionUpdate,
} from "@entities/models/section/form";
import type { SectionFormTypes } from "@entities/models/section/types";
import type { PostType } from "@entities/models/post/types";
import { syncManyToMany } from "@entities/core/utils/syncManyToMany";

export function useSectionForm(id?: string) {
    const [posts, setPosts] = useState<PostType[]>([]);

    useEffect(() => {
        postService.list().then(({ data }) => setPosts(data ?? []));
    }, []);

    const fieldConfig: FieldConfig<SectionFormTypes> = Object.keys(initialSectionForm).reduce(
        (acc, key) => ({
            ...acc,
            [key]: {
                parse: (v) => v as SectionFormTypes[keyof SectionFormTypes],
                serialize: (v) => v as unknown,
                emptyValue: initialSectionForm[key as keyof SectionFormTypes],
            },
        }),
        {} as FieldConfig<SectionFormTypes>
    );

    const fetch = async () => {
        if (!id) return null;
        const { data } = await sectionService.get({ id });
        if (!data) return null;
        const postIds = await sectionPostService.listByParent(id);
        return { id, ...toSectionForm(data, postIds) };
    };

    const create = async (form: SectionFormTypes) => {
        const { data } = await sectionService.create(toSectionCreate(form));
        if (data) {
            await syncManyToMany(
                [],
                form.postIds,
                (postId) => sectionPostService.create(data.id, postId),
                () => Promise.resolve()
            );
        }
    };

    const update = async (
        entity: (SectionFormTypes & { id?: string }) | null,
        form: SectionFormTypes
    ) => {
        if (!entity?.id) return;
        await sectionService.update({ id: entity.id, ...toSectionUpdate(form) });
        await syncManyToMany(
            await sectionPostService.listByParent(entity.id),
            form.postIds,
            (postId) => sectionPostService.create(entity.id!, postId),
            (postId) => sectionPostService.delete(entity.id!, postId)
        );
    };

    const remove = async (entity: (SectionFormTypes & { id?: string }) | null) => {
        if (!entity?.id) return;
        await sectionService.delete({ id: entity.id });
    };

    const manager = useEntityManager<SectionFormTypes>({
        fetch,
        create,
        update,
        remove,
        labels: (f) => f,
        fields: Object.keys(initialSectionForm) as (keyof SectionFormTypes)[],
        initialData: initialSectionForm,
        config: fieldConfig,
    });

    return {
        form: manager.formData,
        posts,
        loading: manager.loading,
        save: manager.save,
        delete: manager.deleteEntity,
    };
}
