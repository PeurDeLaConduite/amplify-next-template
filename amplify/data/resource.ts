import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
    Todo: a
        .model({
            content: a.string(),
            comments: a.hasMany("Comment", "todoId"), // ✅ référence explicite
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.owner(),
        ]),

    Comment: a
        .model({
            content: a.string(),
            todoId: a.id(),
            todo: a.belongsTo("Todo", "todoId"),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["create"]),
            allow.owner(),
        ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "userPool",
        apiKeyAuthorizationMode: {
            expiresInDays: 30,
        },
    },
});
