import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
    UserProfile: a
        .model({
            firstName: a.string(),
            familyName: a.string(),
            address: a.string(),
            postalCode: a.string(),
            city: a.string(),
            country: a.string(),
            phoneNumber: a.string(),
        })
        .authorization((allow) => [allow.owner()]),
    Todo: a
        .model({
            content: a.string(),
            comments: a.hasMany("Comment", "todoId"), // ✅ référence explicite
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.group("admin").to(["create", "update", "delete", "read"]),
            // allow.owner(),
        ]),

    Comment: a
        .model({
            content: a.string(),
            todoId: a.id(),
            todo: a.belongsTo("Todo", "todoId"),
            owner: a.string(),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]), // lecture publique
            allow.authenticated().to(["read"]), // créer uniquement
            allow.group("admin").to(["create", "update", "delete", "read"]),
            allow.owner(),
        ]),
});

export type Schema = ClientSchema<typeof schema>;
export const amplifyConfig = {
    data: {
        modelIntrospection: {
            enableLazyLoading: true, // ✅ permet d'utiliser todo.comments()
        },
    },
};

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "userPool",
        apiKeyAuthorizationMode: {
            expiresInDays: 30,
        },
    },
});
