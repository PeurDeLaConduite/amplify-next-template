"use client";

import React, { useMemo } from "react";
import { UiButton } from "@components/ui/Button";
import type { TagType } from "@entities/models/tag/types";
import type { PostType } from "@entities/models/post/types";

interface Props {
    posts: PostType[];
    tags: TagType[];
    tagsForPost: (postId: string) => TagType[];
    isTagLinked: (postId: string, tagId: string) => boolean;
    toggle: (postId: string, tagId: string) => Promise<void>;
    loading: boolean;
}

function PostTagsRelationManagerInner({
    posts,
    tags,
    tagsForPost,
    isTagLinked,
    toggle,
    loading,
}: Props) {
    // (Option) cache simple: construit une Map postId -> TagType[]
    const tagsMap = useMemo(() => {
        const m = new Map<string, TagType[]>();
        for (const p of posts) m.set(p.id, tagsForPost(p.id));
        return m;
    }, [posts, tagsForPost]);

    return (
        <div className="p-4 mb-6 bg-gray-50 rounded-lg border">
            <h2 className="font-semibold text-lg mb-3">Associer les tags aux articles</h2>
            {loading ? (
                <div className="text-center text-gray-400 py-8">Chargement…</div>
            ) : (
                <ul className="divide-y">
                    {posts.map((post) => (
                        <li key={post.id} className="py-6">
                            <div className="mb-1 flex items-center gap-2">
                                <span className="font-semibold text-lg">{post.title}</span>
                                <span className="text-gray-400 text-xs">({post.slug})</span>
                            </div>

                            <div className="mb-2 text-sm text-gray-600 flex flex-wrap gap-1 items-center">
                                Tags associés :
                                {tagsMap.get(post.id)?.length ? (
                                    tagsMap.get(post.id)!.map((t) => (
                                        <span
                                            key={t.id}
                                            className="inline-block bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 mr-1 text-xs border border-blue-200"
                                        >
                                            {t.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400 ml-2">Aucun tag associé</span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => {
                                    const linked = isTagLinked(post.id, tag.id);
                                    return (
                                        <UiButton
                                            key={tag.id}
                                            variantType="button"
                                            label={tag.name}
                                            intent={linked ? "primary" : "ghost"}
                                            variant={linked ? "contained" : "outlined"}
                                            sx={{
                                                fontWeight: linked ? 700 : 400,
                                                opacity: linked ? 1 : 0.7,
                                                borderColor: "#bbb",
                                                minHeight: 32,
                                                borderRadius: 2,
                                                fontSize: 14,
                                                transition: "all .15s",
                                            }}
                                            buttonProps={{ onClick: () => toggle(post.id, tag.id) }}
                                        />
                                    );
                                })}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// Bail-out: tant que posts/tags/loading et les callbacks ne changent pas,
// on NE re-render PAS quand on tape dans l'input du TagForm.
const PostTagsRelationManager = React.memo(
    PostTagsRelationManagerInner,
    (prev, next) =>
        prev.loading === next.loading &&
        prev.posts === next.posts &&
        prev.tags === next.tags &&
        prev.tagsForPost === next.tagsForPost &&
        prev.isTagLinked === next.isTagLinked &&
        prev.toggle === next.toggle
);

export default PostTagsRelationManager;
