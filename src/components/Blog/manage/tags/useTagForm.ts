import { useState, useEffect, useCallback, type ChangeEvent } from "react";

import { crudService } from "@/src/services";
import {
    postService,
    tagService,
    postTagService,
    TagForm,
    Tag,
    Post,
    PostTag,
} from "@src/entities";
import { initialTagForm } from "@/src/utils/modelForm";

export function useTagForm() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [postTags, setPostTags] = useState<PostTag[]>([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState<TagForm>(initialTagForm);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const [tagsData, postsData, postTagsData] = await Promise.all([
            tagService.list(),
            postService.list(),
            crudService("PostTag").list(),
        ]);
        setTags(tagsData.data ?? []);
        setPosts(postsData.data ?? []);
        setPostTags(postTagsData.data ?? []);
        setLoading(false);
    }, []);

    useEffect(() => {
        void fetchAll();
    }, [fetchAll]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleEdit = async (idx: number) => {
        const tag = tags[idx];
        const postIds = await postTagService.listByChild(tag.id);
        setForm({ name: tag.name ?? "", postIds });
        setEditingIndex(idx);
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setForm({ name: "", postIds: [] });
    };

    async function syncRelations(tagId: string) {
        const current = await postTagService.listByChild(tagId);
        const toAdd = form.postIds.filter((id) => !current.includes(id));
        const toRemove = current.filter((id) => !form.postIds.includes(id));
        await Promise.all([
            ...toAdd.map((postId) => postTagService.create(postId, tagId)),
            ...toRemove.map((postId) => postTagService.delete(postId, tagId)),
        ]);
    }

    const handleSubmit = async () => {
        if (!form.name.trim()) return;

        if (editingIndex === null) {
            const { data } = await tagService.create({ name: form.name });
            if (data) await syncRelations(data.id);
        } else {
            const tag = tags[editingIndex];
            await tagService.update({ id: tag.id, name: form.name });
            await syncRelations(tag.id);
        }

        await fetchAll();
        handleCancel();
    };

    const handleDelete = async (idx: number) => {
        const tag = tags[idx];
        if (!window.confirm("Supprimer ce tag ?")) return;
        const linkedPosts = await postTagService.listByChild(tag.id);
        await Promise.all(linkedPosts.map((p) => postTagService.delete(p, tag.id)));
        await tagService.delete({ id: tag.id });
        await fetchAll();
    };

    const handleAddPostTag = async (postId: string, tagId: string) => {
        await postTagService.create(postId, tagId);
        setPostTags((prev) => [...prev, { postId, tagId } as PostTag]);
    };

    const handleRemovePostTag = async (postId: string, tagId: string) => {
        await postTagService.delete(postId, tagId);
        setPostTags((prev) => prev.filter((pt) => !(pt.postId === postId && pt.tagId === tagId)));
    };

    const tagsForPost = useCallback(
        (postId: string) => {
            const tagIds = postTags.filter((pt) => pt.postId === postId).map((pt) => pt.tagId);
            return tags.filter((t) => tagIds.includes(t.id));
        },
        [postTags, tags]
    );

    const isTagLinked = useCallback(
        (postId: string, tagId: string) =>
            postTags.some((pt) => pt.postId === postId && pt.tagId === tagId),
        [postTags]
    );

    return {
        tags,
        posts,
        form,
        editingIndex,
        loading,
        setForm,
        handleChange,
        handleEdit,
        handleCancel,
        handleSubmit,
        handleDelete,
        handleAddPostTag,
        handleRemovePostTag,
        tagsForPost,
        isTagLinked,
        fetchAll,
    };
}

export type UseTagFormReturn = ReturnType<typeof useTagForm>;
