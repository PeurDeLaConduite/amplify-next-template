"use client";
import { generateClient } from "aws-amplify/data";
import { signInWithRedirect } from "aws-amplify/auth";
const client = generateClient();

export default function Page() {
    async function load() {
        try {
            const res = await client.graphql({
                query: /* GraphQL */ `
                    query {
                        listTodos {
                            items {
                                id
                                content
                            }
                        }
                    }
                `,
                authMode: "apiKey",
            });
            console.log(res);
        } catch (e) {
            console.error(e);
        }
    }
    return (
        <div className="p-4 space-x-2">
            <button onClick={() => signInWithRedirect()}>Login</button>
            <button
                onClick={async () => {
                    try {
                        const res = await client.graphql({ query: `{ __typename }` });
                        console.log("OK:", res);
                    } catch (e) {
                        console.error("ERR:", e);
                    }
                }}
            >
                Test GraphQL
            </button>
            <button onClick={load}>Charger Todo public</button>
        </div>
    );
}
