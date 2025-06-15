// import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

// const schema = a.schema({
//     Post: a
//         .model({
//             id: a.id().required(),
//             title: a.string().required(),
//             content: a.string(),
//             excerpt: a.string(),
//             publishedAt: a.datetime(),
//             authorId: a.id().required(),
//             sectionId: a.id(),
//             tags: a.string().array(),
//             coverImage: a.string(),
//         })
//         .authorization((allow) => [
//             allow.publicApiKey().to(["read"]),
//             allow.authenticated().to(["read"]),
//             allow.group("ADMINS").to(["create", "update", "delete", "read"]),
//         ]),

//     Section: a
//         .model({
//             id: a.id().required(),
//             name: a.string().required(),
//             description: a.string(),
//             slug: a.string(),
//         })
//         .authorization((allow) => [
//             allow.publicApiKey().to(["read"]),
//             allow.authenticated().to(["read"]),
//             allow.group("ADMINS").to(["create", "update", "delete", "read"]),
//         ]),

//     Author: a
//         .model({
//             id: a.id().required(),
//             displayName: a.string().required(),
//             bio: a.string(),
//             avatarUrl: a.string(),
//         })
//         .authorization((allow) => [
//             allow.publicApiKey().to(["read"]),
//             allow.authenticated().to(["read"]),
//             allow.group("ADMINS").to(["create", "update", "delete", "read"]),
//         ]),

//     Tag: a
//         .model({
//             id: a.id().required(),
//             name: a.string().required(),
//         })
//         .authorization((allow) => [
//             allow.publicApiKey().to(["read"]),
//             allow.authenticated().to(["read"]),
//             allow.group("ADMINS").to(["create", "update", "delete", "read"]),
//         ]),
// });

// export type Schema = ClientSchema<typeof schema>;

// export const data = defineData({
//     schema,
//     authorizationModes: {
//         defaultAuthorizationMode: "userPool",
//         apiKeyAuthorizationMode: {
//             expiresInDays: 30,
//         },
//     },
// });
