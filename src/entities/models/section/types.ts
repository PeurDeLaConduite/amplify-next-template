import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@entities/core";
import { type SeoTypeOmit } from "@entities/customTypes/seo/types";

export type SectionType = BaseModel<"Section">;
export type SectionTypeOmit = CreateOmit<"Section">;
export type SectionTypeUpdateInput = UpdateInput<"Section">;

type PostCustomType = { seo: SeoTypeOmit };

export type SectionFormType = ModelForm<"Section", "posts", "post", PostCustomType, "seo">;
