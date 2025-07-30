// src/utils/omitId.ts

export function omitId<T extends { id?: unknown }>(obj: T): Omit<T, "id"> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _removed, ...rest } = obj;
    return rest;
}
