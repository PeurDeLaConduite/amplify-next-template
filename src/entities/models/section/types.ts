import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@myTypes/amplifyBaseTypes";
import { type SeoTypeOmit } from "@src/entities";


export type SectionTypes = BaseModel<"Section">;
export type SectionTypesOmit = CreateOmit<"Section">;
export type SectionTypesUpdateInput = UpdateInput<"Section">;

type PostCustomTypes = { seo: SeoTypeOmit };

export type SectionFormTypes = ModelForm<"Section", "posts", "post", PostCustomTypes, "seo">;
