import type { ModelForm } from "@/src/utils/createModelForm";
import { SeoOmit } from "../../types/models/seo";
type PostCustomTypes = { seo: SeoOmit };

export type SectionForm = ModelForm<"Section", "posts", "post", PostCustomTypes, "seo">;
