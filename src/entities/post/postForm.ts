import type { ModelForm } from "@/src/utils/createModelForm";
import { SeoOmit } from "../seo/seo";
type PostCustomTypes = { seo: SeoOmit };
export type PostForm = ModelForm<
    "Post",
    "comments" | "sections" | "tags" | "author",
    "tag" | "section",
    PostCustomTypes,
    "seo"
>;
