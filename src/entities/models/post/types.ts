// AUTO-GENERATED – DO NOT EDIT
import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@myTypes/amplifyBaseTypes";

import type { SeoForm } from "@src/entities/customTypes/seo/form";

export type PostType = BaseModel<"Post">;
export type PostCreateOmit = CreateOmit<"Post">;
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
