// services/relationService.ts
import { client } from "./amplifyClient";
import type { Schema } from "@/amplify/data/resource";

type ModelKey = keyof typeof client.models;

interface RelationModel<ParentIdKey extends string, ChildIdKey extends string> {
    create: (parentId: string, childId: string) => Promise<void>;
    delete: (parentId: string, childId: string) => Promise<void>;
    listByParent: (parentId: string) => Promise<string[]>;
    listByChild: (childId: string) => Promise<string[]>;
}

export function relationService<
    K extends ModelKey,
    ParentIdKey extends keyof Schema[K]["type"] & string,
    ChildIdKey extends keyof Schema[K]["type"] & string,
>(
    modelName: K,
    parentIdKey: ParentIdKey,
    childIdKey: ChildIdKey
): RelationModel<ParentIdKey, ChildIdKey> {
    const model = client.models[modelName];

    return {
        async create(parentId: string, childId: string) {
            await model.create({ [parentIdKey]: parentId, [childIdKey]: childId });
        },

        async delete(parentId: string, childId: string) {
            await model.delete({ [parentIdKey]: parentId, [childIdKey]: childId });
        },

        async listByParent(parentId: string) {
            const { data } = await model.list({
                filter: { [parentIdKey]: { eq: parentId } },
            });
            return data.map((item: any) => item[childIdKey]);
        },

        async listByChild(childId: string) {
            const { data } = await model.list({
                filter: { [childIdKey]: { eq: childId } },
            });
            return data.map((item: any) => item[parentIdKey]);
        },
    };
}
