// src/entities/core/utils/createM2MSync.ts
import { syncManyToMany } from "./syncManyToMany";

export interface ManyToManyCrud<P extends string, C extends string> {
    listByParent(parentId: P): Promise<readonly C[]>;
    listByChild(childId: C): Promise<readonly P[]>;
    create(parentId: P, childId: C): Promise<unknown>;
    delete(parentId: P, childId: C): Promise<unknown>;
}

const isSameSet = <T extends string>(a: readonly T[], b: readonly T[]) => {
    if (a.length !== b.length) return false;
    const s = new Set(a);
    for (const x of b) if (!s.has(x)) return false;
    return true;
};

/** Fabrique des fonctions de sync pour une relation N↔N donnée */
export function createM2MSync<P extends string, C extends string>(service: ManyToManyCrud<P, C>) {
    const syncByParent = async (parentId: P, targetChildIds: readonly C[]) => {
        const current = await service.listByParent(parentId);
        const target = Array.from(new Set(targetChildIds)); // dedupe

        if (isSameSet(current, target)) return; // short-circuit
        await syncManyToMany(
            current,
            target,
            (childId) => service.create(parentId, childId),
            (childId) => service.delete(parentId, childId)
        );
    };

    const syncByChild = async (childId: C, targetParentIds: readonly P[]) => {
        const current = await service.listByChild(childId);
        const target = Array.from(new Set(targetParentIds)); // dedupe

        if (isSameSet(current, target)) return; // short-circuit
        await syncManyToMany(
            current,
            target,
            (parentId) => service.create(parentId, childId),
            (parentId) => service.delete(parentId, childId)
        );
    };

    return { syncByParent, syncByChild };
}
