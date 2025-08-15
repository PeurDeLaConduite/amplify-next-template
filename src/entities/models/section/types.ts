import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@entities/core/types";
import { type SeoTypeOmit } from "@entities/customTypes/seo/types";

export type SectionTypes = BaseModel<"Section">;
export type SectionTypesOmit = CreateOmit<"Section">;
export type SectionTypesCreateInput = UpdateInput<"Section">;
export type SectionTypesUpdateInput = { id: string } & Partial<SectionTypesCreateInput>;

type PostCustomTypes = { seo: SeoTypeOmit };

export type SectionFormTypes = ModelForm<"Section", "posts", "post", PostCustomTypes, "seo">;
