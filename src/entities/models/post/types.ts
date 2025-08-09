// AUTO-GENERATED – DO NOT EDIT
import type { BaseModel, CreateInput, UpdateInput, ModelForm } from "@myTypes/amplifyBaseTypes";

import type { SeoForm } from "@src/entities/customTypes/seo/form";

export type PostType = BaseModel<"Post">;
export type PostCreateInput = CreateInput<"Post">;
export type PostTypeUpdateInput = UpdateInput<"Post">;

type CTMap = { Seo: SeoForm };
type RelKeys = "tag" | "section";

export type PostFormType = ModelForm<
  "Post",
  never,
  RelKeys,
  CTMap,
  "Seo"
>;
