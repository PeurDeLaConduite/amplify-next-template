import type { SeoForm, Seo } from "@src/entities";

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
