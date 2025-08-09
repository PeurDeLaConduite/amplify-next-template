// AUTO-GENERATED – DO NOT EDIT
import type { PostType, PostFormType } from "./types";
import { type ModelForm, createModelForm } from "@src/entities/core/createModelForm";

import { initialSeoForm, toSeoForm } from "@src/entities/customTypes/seo/form";

export const initialPostForm: PostFormType = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  videoUrl: "",
  authorId: "",
  order: 0,
  type: "",
  status: "",
  seo: { ...initialSeoForm },
  tagIds: [] as string[],
  sectionIds: [] as string[],
};

function toPostForm(model: PostType, tagIds: string[] = [], sectionIds: string[] = []): PostFormType {
  return {
  id: model.id ?? "",
  slug: model.slug ?? "",
  title: model.title ?? "",
  excerpt: model.excerpt ?? "",
  content: model.content ?? "",
  videoUrl: model.videoUrl ?? "",
  authorId: model.authorId ?? "",
  order: model.order ?? 0,
  type: model.type ?? "",
  status: model.status ?? "",
  seo: toSeoForm(model.seo),
  tagIds,
  sectionIds,
  };
}

export const postForm = createModelForm<PostType, PostFormType, [string[], string[]]>(
  initialPostForm,
  (model, tagIds: string[] = [], sectionIds: string[] = []) => toPostForm(model, tagIds, sectionIds)
);

export { toPostForm };
