import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@entities/core";
import { type SeoTypeOmit } from "@entities/customTypes/seo/types";

export type SectionType = BaseModel<"Section">;
export type SectionTypeOmit = CreateOmit<"Section">;
export type SectionTypeCreateInput = Omit<SectionTypeOmit, "id" | "posts"> & { id?: string };
export type SectionTypeUpdateInput = UpdateInput<"Section">;

type PostCustomTypes = { seo: SeoTypeOmit };

export type SectionFormTypes = ModelForm<"Section", "posts", "post", PostCustomTypes, "seo">;
