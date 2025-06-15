// async function addComment(todoId: string, content: string) {
//     try {
//         const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
//             },
//             body: JSON.stringify({
//                 query: `
//                     mutation CreateComment($input: CreateCommentInput!) {
//                         createComment(input: $input) {
//                             id
//                             content
//                             createdAt
//                             todo {
//                                 id
//                                 content
//                             }
//                         }
//                     }
//                 `,
//                 variables: {
//                     input: {
//                         content,
//                         todoId,
//                     },
//                 },
//             }),
//         });

//         const { data, errors } = await res.json();

//         if (errors) {
//             console.error("Erreur GraphQL:", errors);
//             return null;
//         }

//         return data.createComment;
//     } catch (err) {
//         console.error("Erreur réseau:", err);
//         return null;
//     }
// }
