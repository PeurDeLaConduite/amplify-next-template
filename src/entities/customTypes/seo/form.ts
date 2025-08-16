// AUTO-GENERATED – DO NOT EDIT
export type SeoForm = {
    title: string;
    description: string;
    image: string;
};

export const initialSeoForm: SeoForm = {
    title: "",
    description: "",
    image: "",
};

export function toSeoForm(value: Partial<SeoForm> | null | undefined): SeoForm {
    if (!value) return { ...initialSeoForm };
    return {
        title: value.title ?? "",
        description: value.description ?? "",
        image: value.image ?? "",
    };
}
