import type { ModelForm } from "@/src/utils/createModelForm";

export type PostForm = ModelForm<
    "Post",
    "comments" | "sections" | "tags" | "author",
    "tag" | "section",
    true
>;
