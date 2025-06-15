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
            content: a.string(),
            todoId: a.id(),
            todo: a.belongsTo("Todo", "todoId"),
            owner: a.string(),

            // 🔑 Clé étrangère vers UserName
            userNameId: a.id().required(),
            userName: a.belongsTo("UserName", "userNameId"),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
            allow.owner(),
        ]),

    UserName: a
        .model({
            // 🔑 id du modèle UserName = sub Cognito
            id: a.id().required(),
            userName: a.string().required(),

            // 🟢 relations inverses (avec bonnes références)
            postComments: a.hasMany("PostComment", "userNameId"),
            comments: a.hasMany("Comment", "userNameId"),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.owner(),
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
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

    Seo: a.customType({
        title: a.string(),
        description: a.string(),
        image: a.string(),
    }),

    Author: a
        .model({
            id: a.id().required(),
            name: a.string().required(),
            bio: a.string(),
            email: a.string(),
            avatar: a.string(),
            posts: a.hasMany("Post", "authorId"),
            order: a.integer(),
            createdAt: a.datetime(),
            updatedAt: a.datetime(),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
        ]),

    Section: a
        .model({
            id: a.id().required(),
            slug: a.string().required(),
            title: a.string().required(),
            description: a.string(),
            order: a.integer(),
            posts: a.hasMany("SectionPost", "sectionId"),
            seo: a.ref("Seo"),
            createdAt: a.datetime(),
            updatedAt: a.datetime(),
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

    Post: a
        .model({
            id: a.id().required(),
            slug: a.string().required(),
            title: a.string().required(),
            excerpt: a.string(),
            content: a.string(),
            videoUrl: a.string(),
            subtitleSource: a.string(),
            subtitleDownloaded: a.boolean().default(false),
            authorId: a.id().required(),
            author: a.belongsTo("Author", "authorId"),
            relatedPosts: a.hasMany("RelatedPost", "postId"),
            relatedTo: a.hasMany("RelatedPost", "relatedPostId"),
            order: a.integer(),
            type: a.string(),
            status: a.enum(["draft", "published"]),
            seo: a.ref("Seo"),
            createdAt: a.datetime(),
            updatedAt: a.datetime(),
            comments: a.hasMany("PostComment", "postId"),
            sections: a.hasMany("SectionPost", "postId"),
            tags: a.hasMany("PostTag", "postId"),
        })
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

    PostTag: a
        .model({
            postId: a.id().required(),
            tagId: a.id().required(),
            post: a.belongsTo("Post", "postId"),
            tag: a.belongsTo("Tag", "tagId"),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
        ]),

    SectionPost: a
        .model({
            sectionId: a.id().required(),
            postId: a.id().required(),
            section: a.belongsTo("Section", "sectionId"),
            post: a.belongsTo("Post", "postId"),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
        ]),

    RelatedPost: a
        .model({
            postId: a.id().required(),
            relatedPostId: a.id().required(),
            post: a.belongsTo("Post", "postId"),
            related: a.belongsTo("Post", "relatedPostId"),
        })
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
