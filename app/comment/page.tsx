"use client";

import { useEffect, useState } from "react";
import type { Schema } from "@/amplify/data/resource";

export default function CommentsPublicPage() {
    const [comments, setComments] = useState<
        Array<Schema["Comment"]["type"] & { todo?: { id: string; content: string } }>
    >([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(
                    "https://wgs4qa4ymrakzgkszevnzciv74.appsync-api.eu-west-3.amazonaws.com/graphql",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-api-key": "da2-k3duvrzumbbhvhasn5vragagc4",
                        },
                        body: JSON.stringify({
                            query: `
                                query {
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
                    }
                );

                const data = await res.json();
                console.log("GraphQL response:", data);

                if (data.errors) {
                    console.error("GraphQL errors:", data.errors);
                } else {
                    setComments(data.data.listComments.items);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetchComments();
    }, []);

    return (
        <main>
            <h1>Commentaires publics</h1>
            <ul>
                {comments.map((comment) => (
                    <li key={comment.id}>
                        <p>
                            <strong>Commentaire :</strong> {comment.content}
                        </p>
                        {comment.todo && (
                            <p>
                                <strong>Todo associé :</strong> {comment.todo.content} (ID:{" "}
                                {comment.todo.id})
                            </p>
                        )}
                        <hr />
                    </li>
                ))}
            </ul>
        </main>
    );
}
