import { type ModelForm } from "@/src/utils/createModelForm";
import { type Seo } from "@src/entities";
export type SeoForm = ModelForm<"Seo">;

export const initialSeoForm: SeoForm = {
    title: "",
    description: "",
    image: "",
};

export function toSeoForm(seo: Seo | null | undefined): SeoForm {
    return {
        title: seo?.title ?? "",
        description: seo?.description ?? "",
        image: seo?.image ?? "",
    };
}
