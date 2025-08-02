import type { ModelForm } from "@/src/utils/createModelForm";
import { SeoOmit } from "../seo/seo";
type PostCustomTypes = { seo: SeoOmit };

export type SectionForm = ModelForm<"Section", "posts", "post", PostCustomTypes, "seo">;
