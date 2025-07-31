// import type {
//     Section,
//     SectionForm,
//     Post,
//     PostForm,
//     Tag,
//     TagForm,
//     Author,
//     AuthorForm,
// } from "@/src/types";
// import { initialSeoForm, toSeoForm } from "./seoFormUtils";

// export const initialSectionForm: SectionForm = {
//     slug: "",
//     title: "",
//     description: "",
//     order: 1,
//     seo: { ...initialSeoForm },
//     postIds: [],
// };

// export function toSectionForm(section: Section, postIds: string[]): SectionForm {
//     return {
//         slug: section.slug ?? "",
//         title: section.title ?? "",
//         description: section.description ?? "",
//         order: section.order ?? 1,
//         seo: toSeoForm(section.seo),
//         postIds,
//     };
// }

// export const initialPostForm: PostForm = {
//     slug: "",
//     title: "",
//     excerpt: "",
//     content: "",
//     status: "draft",
//     authorId: "",
//     order: 1,
//     seo: { ...initialSeoForm },
//     tagIds: [],
//     sectionIds: [],
// };

// export function toPostForm(post: Post, tagIds: string[], sectionIds: string[]): PostForm {
//     return {
//         slug: post.slug ?? "",
//         title: post.title ?? "",
//         excerpt: post.excerpt ?? "",
//         content: post.content ?? "",
//         status: (post.status as "draft" | "published") ?? "draft",
//         authorId: post.authorId ?? "",
//         order: post.order ?? 1,
//         seo: toSeoForm(post.seo),
//         tagIds,
//         sectionIds,
//     };
// }

// export const initialTagForm: TagForm = {
//     name: "",
//     postIds: [],
// };

// export function toTagForm(tag: Tag, postIds: string[]): TagForm {
//     return {
//         name: tag.name ?? "",
//         postIds,
//     };
// }

// export const initialAuthorForm: AuthorForm = {
//     name: "",
//     avatar: "",
//     bio: "",
//     email: "",
//     postIds: [],
// };

// export function toAuthorForm(author: Author, postIds: string[]): AuthorForm {
//     return {
//         name: author.name ?? "",
//         avatar: author.avatar ?? "",
//         bio: author.bio ?? "",
//         email: author.email ?? "",
//         postIds,
//     };
// }
