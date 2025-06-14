import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
    Todo: a
        .model({
            content: a.string(),
            isDone: a.boolean(),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]), // Accès public en lecture
            allow.authenticated().to(["read"]),
            allow.owner(), // Le propriétaire peut créer, modifier, supprimer
        ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "userPool", // Auth principal = Cognito
        apiKeyAuthorizationMode: {
            expiresInDays: 30,
        },
    },
});
