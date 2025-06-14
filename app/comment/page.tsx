"use client";

import { useEffect, useState } from "react";
import type { Schema } from "@/amplify/data/resource";

export default function CommentsPublicPage() {
    const [comments, setComments] = useState<Array<Schema["Comment"]["type"]>>([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(
                    "https://rydb4thk25bkhd7eimmux4hrku.appsync-api.eu-west-3.amazonaws.com/graphql",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-api-key": "da2-3xmd4yvcg5e35d7cra3jh6ouaq", // <- vérifie qu’elle correspond à outputs.data.api_key
                        },
                        body: JSON.stringify({
                            query: `
                                query {
                                    listComments {
                                        items {
                                            id
                                            content
                                            createdAt
                                        }
                                    }
                                }
                            `,
                        }),
                    }
                );

                const data = await res.json();

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
                    <li key={comment.id}>{comment.content}</li>
                ))}
            </ul>
        </main>
    );
}
