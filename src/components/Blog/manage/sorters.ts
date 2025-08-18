// src/components/common/sorters.ts
export const byOptionalOrder = <T extends { order?: number | null }>(a: T, b: T) =>
    (a.order ?? 0) - (b.order ?? 0);
