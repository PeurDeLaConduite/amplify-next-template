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
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
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
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
            allow.owner(),
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

    UserName: a
        .model({
            userName: a.string().required(),
            userId: a.id().required(),
            comments: a.hasMany("PostComment", "userNameId"),
        })
        .authorization((allow) => [allow.publicApiKey().to(["read"]), allow.owner()]),

    Seo: a.customType({
        title: a.string(),
        description: a.string(),
        image: a.string(),
    }),

    // --- Author ---
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

    // --- Section ---
    Section: a
        .model({
            id: a.id().required(),
            slug: a.string().required(),
            title: a.string().required(),
            description: a.string(),
            order: a.integer(),
            posts: a.hasMany("SectionPost", "sectionId"), // relation many-to-many via SectionPost
            seo: a.ref("Seo"),
            createdAt: a.datetime(),
            updatedAt: a.datetime(),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
        ]),

    // --- Tag ---
    Tag: a
        .model({
            id: a.id().required(),
            name: a.string().required(),
            posts: a.hasMany("PostTag", "tagId"), // many-to-many
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
        ]),

    // --- Post ---
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
            postId: a.id().required(),
            post: a.belongsTo("Post", "postId"),
            userNameId: a.id().required(),
            userName: a.belongsTo("UserName", "userNameId"),
            owner: a.string(),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]), // lecture publique
            allow.authenticated().to(["read"]), // créer uniquement
            allow.group("ADMINS").to(["create", "update", "delete", "read"]),
            allow.owner(),
        ]),
    // --- Table de jointure Post/Tag ---
    PostTag: a.model({
        postId: a.id().required(),
        tagId: a.id().required(),
        post: a.belongsTo("Post", "postId"),
        tag: a.belongsTo("Tag", "tagId"),
    }),

    // --- Table de jointure Section/Post ---
    SectionPost: a.model({
        sectionId: a.id().required(),
        postId: a.id().required(),
        section: a.belongsTo("Section", "sectionId"),
        post: a.belongsTo("Post", "postId"),
    }),

    // --- Table de jointure pour posts liés (related posts) ---
    RelatedPost: a.model({
        postId: a.id().required(),
        relatedPostId: a.id().required(),
        post: a.belongsTo("Post", "postId"),
        related: a.belongsTo("Post", "relatedPostId"),
    }),
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
