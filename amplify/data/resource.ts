import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
    Todo: a
        .model({
            content: a.string(),
            comments: a.hasMany("Comment", "todoId"),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
        ]),

    Comment: a
        .model({
            id: a.id().required(),
            content: a.string(),
            todoId: a.id().required(),
            todo: a.belongsTo("Todo", "todoId"),

            owner: a.string(),
            userNameId: a.id().required(),
            userName: a.belongsTo("UserName", "userNameId"),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
            allow.owner().to(["create", "update", "delete", "read"]),
        ]),

    UserName: a
        .model({
            id: a.id().required(),
            userName: a.string().required(),
            owner: a.string().required(),
            // ← ici on déclare les deux hasMany sans clé manuelle
            comments: a.hasMany("Comment", "userNameId"),
            postComments: a.hasMany("PostComment", "userNameId"),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]), // lecture publique
            allow.authenticated().to(["create", "read", "delete"]), // create/read pour tout user logué
            allow.owner().to(["read", "update", "delete"]), // propriétaire peut maj/suppr
        ]),

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

    Author: a
        .model({
            id: a.id().required(),
            authorName: a.string().required(),
            bio: a.string(),
            email: a.string(),
            avatar: a.string(),
            posts: a.hasMany("Post", "authorId"),
            order: a.integer(),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
        ]),

    Seo: a.customType({
        title: a.string(),
        description: a.string(),
        image: a.string(),
    }),

    Section: a
        .model({
            id: a.id().required(),
            title: a.string().required(),
            slug: a.string().required(),
            description: a.string(),
            order: a.integer(),
            posts: a.hasMany("SectionPost", "sectionId"),
            seo: a.ref("Seo"),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
        ]),

    Post: a
        .model({
            id: a.id().required(),
            slug: a.string().required(),
            title: a.string().required(),
            excerpt: a.string(),
            content: a.string(),
            videoUrl: a.string(),
            authorId: a.id().required(),
            author: a.belongsTo("Author", "authorId"),
            order: a.integer(),
            type: a.string(),
            status: a.enum(["draft", "published"]),
            seo: a.ref("Seo"),
            comments: a.hasMany("PostComment", "postId"),
            sections: a.hasMany("SectionPost", "postId"),
            tags: a.hasMany("PostTag", "postId"),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
        ]),

    Tag: a
        .model({
            id: a.id().required(),
            name: a.string().required(),
            posts: a.hasMany("PostTag", "tagId"),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
        ]),

    PostTag: a
        .model({
            postId: a.id().required(),
            tagId: a.id().required(),
            post: a.belongsTo("Post", "postId"),
            tag: a.belongsTo("Tag", "tagId"),
        })
        .identifier(["postId", "tagId"])
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
        ]),

    PostComment: a
        .model({
            id: a.id().required(),
            content: a.string().required(),
            owner: a.string(),

            postId: a.id().required(),
            post: a.belongsTo("Post", "postId"),

            userNameId: a.id().required(),
            userName: a.belongsTo("UserName", "userNameId"),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
            allow.owner(),
        ]),

    SectionPost: a
        .model({
            sectionId: a.id().required(),
            postId: a.id().required(),
            section: a.belongsTo("Section", "sectionId"),
            post: a.belongsTo("Post", "postId"),
        })
        .identifier(["sectionId", "postId"])
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
        ]),
});

export type Schema = ClientSchema<typeof schema>;

export const amplifyConfig = {
    data: {
        modelIntrospection: {
            enableLazyLoading: true,
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
