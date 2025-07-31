import type { SeoForm } from "@/src/types/forms/seoForm";
import type { Seo } from "@/src/types/models/seo";

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
