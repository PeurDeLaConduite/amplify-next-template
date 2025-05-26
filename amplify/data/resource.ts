import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Post: a.model({
    id: a.id().required(),
    title: a.string().required(),
    content: a.string(),
    excerpt: a.string(),
    publishedAt: a.datetime(),
    authorId: a.id().required(),
    sectionId: a.id(),
    tags: a.string().array(),
    coverImage: a.string(),
  })
  .identifier(['id'])
  .authorization((allow) => [
    allow.publicApiKey().to(['read']),
    allow.group('admin').to(['create', 'update', 'delete', 'read']),
  ]),

  Section: a.model({
    id: a.id().required(),
    name: a.string().required(),
    description: a.string(),
    slug: a.string(),
  })
  .identifier(['id'])
  .authorization((allow) => [
    allow.publicApiKey().to(['read']),
    allow.group('admin').to(['create', 'update', 'delete', 'read']),
  ]),

  Author: a.model({
    id: a.id().required(),
    displayName: a.string().required(),
    bio: a.string(),
    avatarUrl: a.string(),
  })
  .identifier(['id'])
  .authorization((allow) => [
    allow.publicApiKey().to(['read']),
    allow.group('admin').to(['create', 'update', 'delete', 'read']),
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
