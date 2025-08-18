// src/components/Blog/manage/sorters.ts

export const byOptionalOrder = <T extends { order?: number | null }>(a: T, b: T) => {
    const ao = a.order;
    const bo = b.order;
    if (ao == null && bo == null) return 0;
    if (ao == null) return 1;
    if (bo == null) return -1;
    return ao - bo;
};

export const byAlpha =
    <T>(pick: (item: T) => string) =>
    (a: T, b: T) =>
        pick(a).localeCompare(pick(b), undefined, { sensitivity: "base" });
