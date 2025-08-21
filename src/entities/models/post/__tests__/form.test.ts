import { describe, it, expect } from "vitest";
import { faker } from "@faker-js/faker";
import { toPostForm, toPostCreate, toPostUpdate } from "@entities/models/post/form";
import type { PostType, PostFormType } from "@entities/models/post/types";

describe("toPostForm", () => {
    it("convertit PostType en PostFormType", () => {
        const tagIds = [faker.string.uuid(), faker.string.uuid()];
        const sectionIds = [faker.string.uuid()];

        const post = {
            slug: faker.lorem.slug(),
            title: faker.lorem.words(3),
            excerpt: faker.lorem.sentence(),
            content: faker.lorem.paragraph(),
            status: "draft",
            authorId: faker.string.uuid(),
            order: faker.number.int(),
            videoUrl: faker.internet.url(),
            type: faker.lorem.word(),
            seo: {
                title: faker.lorem.words(2),
                description: faker.lorem.sentence(),
                image: faker.image.url(),
            },
            tags: tagIds.map((tagId) => ({ tagId })),
            sections: sectionIds.map((sectionId) => ({ sectionId })),
        } as unknown as PostType;

        const form = toPostForm(post);
        expect(form).toEqual({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            status: post.status,
            authorId: post.authorId,
            order: post.order,
            videoUrl: post.videoUrl,
            type: post.type,
            seo: post.seo,
            tagIds,
            sectionIds,
        });
    });
});

describe("toPostCreate / toPostUpdate", () => {
    it("supprime tagIds et sectionIds", () => {
        const form: PostFormType = {
            slug: faker.lorem.slug(),
            title: faker.lorem.words(3),
            excerpt: faker.lorem.sentence(),
            content: faker.lorem.paragraph(),
            status: "published",
            authorId: faker.string.uuid(),
            order: faker.number.int(),
            videoUrl: faker.internet.url(),
            type: faker.lorem.word(),
            seo: {
                title: faker.lorem.words(2),
                description: faker.lorem.sentence(),
                image: faker.image.url(),
            },
            tagIds: [faker.string.uuid()],
            sectionIds: [faker.string.uuid()],
        };

        const expected = {
            slug: form.slug,
            title: form.title,
            excerpt: form.excerpt,
            content: form.content,
            status: form.status,
            authorId: form.authorId,
            order: form.order,
            videoUrl: form.videoUrl,
            type: form.type,
            seo: form.seo,
        };

        expect(toPostCreate(form)).toEqual(expected);
        expect(toPostUpdate(form)).toEqual(expected);
    });
});
