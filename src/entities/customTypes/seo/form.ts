import type { SeoType, SeoFormType } from "./types";

export const initialSeoForm: SeoFormType = {
    title: "",
    description: "",
    image: "",
};

export function toSeoForm(seo: SeoType | null | undefined): SeoFormType {
    return {
        title: seo?.title ?? "",
        description: seo?.description ?? "",
        image: seo?.image ?? "",
    };
}
