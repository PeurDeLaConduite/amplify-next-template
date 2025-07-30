import type { Schema } from "@/amplify/data/resource";

export const initialSeoForm = {
    title: "",
    description: "",
    image: "",
};

export function toSeoForm(seo?: Schema["Post"]["type"]["seo"]) {
    return {
        title: seo?.title ?? initialSeoForm.title,
        description: seo?.description ?? initialSeoForm.description,
        image: seo?.image ?? initialSeoForm.image,
    };
}
