// AUTO-GENERATED – DO NOT EDIT
import type { BaseModel, CreateInput, UpdateInput, ModelForm } from "@myTypes/amplifyBaseTypes";

import type { SeoForm } from "@src/entities/customTypes/seo/form";

export type SectionType = BaseModel<"Section">;
export type SectionCreateInput = CreateInput<"Section">;
export type SectionTypeUpdateInput = UpdateInput<"Section">;

type CTMap = { Seo: SeoForm };
type RelKeys = "post";

export type SectionFormType = ModelForm<
  "Section",
  never,
  RelKeys,
  CTMap,
  "Seo"
>;
