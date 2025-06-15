"use client";

import { useEffect, useState } from "react";
import type { Schema } from "@/amplify/data/resource";

type CommentWithTodo = Schema["Comment"]["type"] & {
    todo?: { id: string; content: string } | null;
};

type GroupedComments = {
    [todoId: string]: {
        todo: { id: string; content: string };
        comments: CommentWithTodo[];
    };
};
async function addComment(todoId: string, content: string) {
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
            },
            body: JSON.stringify({
                query: `
                    mutation CreateComment($input: CreateCommentInput!) {
                        createComment(input: $input) {
                            id
                            content
                            createdAt
                            todo {
                                id
                                content
                            }
                        }
                    }
                `,
                variables: {
                    input: {
                        content,
                        todoId,
                    },
                },
            }),
        });

        const { data, errors } = await res.json();
        if (errors) {
            console.error("GraphQL errors:", errors);
            return null;
        }

        return data.createComment;
    } catch (err) {
        console.error("Erreur réseau:", err);
        return null;
    }
}

export default function CommentsPublicPage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [comments, setComments] = useState<CommentWithTodo[]>([]);
    const [grouped, setGrouped] = useState<GroupedComments>({});
    const [orphans, setOrphans] = useState<CommentWithTodo[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
                    },
                    body: JSON.stringify({
                        query: `
                            query ListCommentsWithTodo {
                                listComments {
                                    items {
                                        id
                                        content
                                        createdAt
                                        todo {
                                            id
                                            content
                                        }
                                    }
                                }
                            }
                        `,
                    }),
                });

                const { data, errors } = await res.json();
                // console.log("comments", comments);

                if (errors) {
                    setError("Erreur GraphQL");
                    console.error("GraphQL errors:", errors);
                    return;
                }

                const items: CommentWithTodo[] = data.listComments.items;

                const groups: GroupedComments = {};
                const orphans: CommentWithTodo[] = [];

                for (const comment of items) {
                    const todo = comment.todo;
                    if (todo && todo.id) {
                        if (!groups[todo.id]) {
                            groups[todo.id] = {
                                todo: { id: todo.id, content: todo.content },
                                comments: [],
                            };
                        }
                        groups[todo.id].comments.push(comment);
                    } else {
                        orphans.push(comment);
                    }
                }

                setComments(items);
                setGrouped(groups);
                setOrphans(orphans);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Erreur réseau ou API");
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, []);

    return (
        <main>
            <h1>🗂️ Commentaires regroupés par Todo</h1>

            {loading && <p>⏳ Chargement...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
                <>
                    <ul>
                        {Object.values(grouped).map(({ todo, comments }) => (
                            <li key={todo.id}>
                                <h2>{todo.content}</h2>
                                <ul>
                                    {comments.map((comment) => (
                                        <li key={comment.id}>
                                            🗨️ {comment.content}
                                            <br />
                                            <small>
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </small>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={async () => {
                                        const content = prompt(
                                            "Quel est le contenu du commentaire ?"
                                        );
                                        if (content) {
                                            const newComment = await addComment(todo.id, content);
                                            if (newComment) {
                                                // Mise à jour du regroupement
                                                setGrouped((prev) => {
                                                    const updated = { ...prev };
                                                    if (!updated[todo.id]) {
                                                        updated[todo.id] = {
                                                            todo,
                                                            comments: [],
                                                        };
                                                    }
                                                    updated[todo.id].comments = [
                                                        ...updated[todo.id].comments,
                                                        newComment,
                                                    ];
                                                    return updated;
                                                });
                                            }
                                        }
                                    }}
                                >
                                    💬 Ajouter un commentaire
                                </button>
                            </li>
                        ))}
                    </ul>

                    {orphans.length > 0 && (
                        <>
                            <h2 style={{ marginTop: "2rem" }}>❌ Commentaires orphelins</h2>
                            <ul>
                                {orphans.map((comment) => (
                                    <li key={comment.id}>
                                        🗨️ {comment.content}
                                        <br />
                                        <small>
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </small>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </>
            )}
        </main>
    );
}
