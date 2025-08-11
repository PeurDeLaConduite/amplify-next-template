import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@src/entities/core";
import { type SeoTypeOmit } from "@src/entities/customTypes/seo/types";

export type SectionTypes = BaseModel<"Section">;
export type SectionTypesOmit = CreateOmit<"Section">;
export type SectionTypesUpdateInput = UpdateInput<"Section">;

type PostCustomTypes = { seo: SeoTypeOmit };

export type SectionFormTypes = ModelForm<"Section", "posts", "post", PostCustomTypes, "seo">;
