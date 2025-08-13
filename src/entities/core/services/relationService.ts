// src/entities/core/services/relationService.ts
import { client } from "./amplifyClient";
import type {
    AuthRule,
    AuthUser,
    Operation,
    ModelKey,
    BaseModel,
    CreateData,
} from "@entities/core/types";
import { canAccessOp } from "../auth/authAccess";

interface RelationCrudModel<K extends ModelKey> {
    create: (data: Partial<CreateData<K>>) => Promise<{ data: BaseModel<K> }>;
    delete: (where: Partial<CreateData<K>>) => Promise<{ data: BaseModel<K> }>;
    list: (args?: { filter?: Record<string, unknown> }) => Promise<{ data: BaseModel<K>[] }>;
}

function getRelationClient<K extends ModelKey>(key: K): RelationCrudModel<K> {
    return client.models[key] as unknown as RelationCrudModel<K>;
}

const READ: Operation = "read";
const CREATE: Operation = "create";
const DELETE: Operation = "delete";

export function relationService<
    K extends ModelKey,
    ParentIdKey extends keyof BaseModel<K> & string,
    ChildIdKey extends keyof BaseModel<K> & string,
>(
    modelName: K,
    user: AuthUser | null,
    rules: AuthRule[] = [{ allow: "public", operations: [READ] }],
    parentIdKey: ParentIdKey,
    childIdKey: ChildIdKey
) {
    const model = getRelationClient(modelName);

    return {
        async create(parentId: string, childId: string) {
            const data = {
                [parentIdKey]: parentId,
                [childIdKey]: childId,
            } as Partial<CreateData<K>>;
            if (!canAccessOp(user, data as Record<string, unknown>, rules, CREATE)) {
                throw new Error("Not authorized (create)");
            }
            await model.create(data);
        },

        async delete(parentId: string, childId: string) {
            const { data: current } = await model.list({
                filter: { [parentIdKey]: { eq: parentId }, [childIdKey]: { eq: childId } },
            });
            const allowed =
                current[0] &&
                canAccessOp(user, current[0] as Record<string, unknown>, rules, DELETE);
            if (!allowed) throw new Error("Not authorized (delete)");
            await model.delete({
                [parentIdKey]: parentId,
                [childIdKey]: childId,
            } as Partial<CreateData<K>>);
        },
        async list(args?: { filter?: Record<string, unknown> }) {
            const { data } = await model.list(args);
            return {
                data: data.filter((item) =>
                    canAccessOp(user, item as Record<string, unknown>, rules, READ)
                ),
            };
        },
        async listByParent(parentId: string) {
            const { data } = await model.list({
                filter: { [parentIdKey]: { eq: parentId } },
            });
            return data
                .filter((item) => canAccessOp(user, item as Record<string, unknown>, rules, READ))
                .map((item) => item[childIdKey]) as string[];
        },

        async listByChild(childId: string) {
            const { data } = await model.list({
                filter: { [childIdKey]: { eq: childId } },
            });
            return data
                .filter((item) => canAccessOp(user, item as Record<string, unknown>, rules, READ))
                .map((item) => item[parentIdKey]) as string[];
        },
    };
}
