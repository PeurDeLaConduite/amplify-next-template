import { useEffect, useState } from "react";
import { useEntityManager, type FieldConfig } from "@entities/core/hooks";
import { tagService } from "@entities/models/tag/service";
import { postService } from "@entities/models/post/service";
import { postTagService } from "@entities/relations/postTag/service";
import { initialTagForm, toTagForm, toTagCreate, toTagUpdate } from "@entities/models/tag/form";
import type { TagFormType } from "@entities/models/tag/types";
import type { PostType } from "@entities/models/post/types";
import { syncManyToMany } from "@entities/core/utils/syncManyToMany";

export function useTagForm(id?: string) {
    const [posts, setPosts] = useState<PostType[]>([]);

    useEffect(() => {
        postService.list().then(({ data }) => setPosts(data ?? []));
    }, []);

    const fieldConfig: FieldConfig<TagFormType> = Object.keys(initialTagForm).reduce(
        (acc, key) => ({
            ...acc,
            [key]: {
                parse: (v) => v as TagFormType[keyof TagFormType],
                serialize: (v) => v as unknown,
                emptyValue: initialTagForm[key as keyof TagFormType],
            },
        }),
        {} as FieldConfig<TagFormType>
    );

    const fetch = async () => {
        if (!id) return null;
        const { data } = await tagService.get({ id });
        if (!data) return null;
        const postIds = await postTagService.listByChild(id);
        return { id, ...toTagForm(data, postIds) };
    };

    const create = async (form: TagFormType) => {
        const { data } = await tagService.create(toTagCreate(form));
        if (data) {
            await syncManyToMany(
                [],
                form.postIds,
                (postId) => postTagService.create(postId, data.id),
                () => Promise.resolve()
            );
        }
    };

    const update = async (entity: (TagFormType & { id?: string }) | null, form: TagFormType) => {
        if (!entity?.id) return;
        await tagService.update({ id: entity.id, ...toTagUpdate(form) });
        await syncManyToMany(
            await postTagService.listByChild(entity.id),
            form.postIds,
            (postId) => postTagService.create(postId, entity.id!),
            (postId) => postTagService.delete(postId, entity.id!)
        );
    };

    const remove = async (entity: (TagFormType & { id?: string }) | null) => {
        if (!entity?.id) return;
        await tagService.delete({ id: entity.id });
    };

    const manager = useEntityManager<TagFormType>({
        fetch,
        create,
        update,
        remove,
        labels: (f) => f,
        fields: Object.keys(initialTagForm) as (keyof TagFormType)[],
        initialData: initialTagForm,
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
