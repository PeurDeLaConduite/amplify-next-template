import React from "react";
import ButtonBase from "@components/buttons/ButtonBase";

export default function TagsAssociationManager({
    posts,
    tags,
    tagsForPost,
    isTagLinked,
    onToggle,
    loading,
}) {
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
                                {tagsForPost(post.id).length > 0 ? (
                                    tagsForPost(post.id).map((t) => (
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
                                {tags.map((tag) => (
                                    <ButtonBase
                                        key={tag.id}
                                        label={tag.name}
                                        onClick={() => onToggle(post.id, tag.id)}
                                        color={isTagLinked(post.id, tag.id) ? "primary" : "inherit"}
                                        variant={
                                            isTagLinked(post.id, tag.id) ? "contained" : "outlined"
                                        }
                                        sx={{
                                            fontWeight: isTagLinked(post.id, tag.id) ? 700 : 400,
                                            opacity: isTagLinked(post.id, tag.id) ? 1 : 0.7,
                                            borderColor: "#bbb",
                                            minHeight: 32,
                                            borderRadius: 2,
                                            fontSize: 14,
                                            transition: "all .15s",
                                        }}
                                    />
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
