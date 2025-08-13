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
import { canAccessOp } from "../auth"; // <-- barrel auth

// Aligne K sur les clés du Schema ET celles de client.models
type ClientModelKey = keyof typeof client.models;
type ModelClientKey = ClientModelKey & ModelKey;

interface RelationCrudModel<K extends ModelClientKey> {
    create: (data: Partial<CreateData<K>>) => Promise<{ data: BaseModel<K> }>;
    // NB: selon Amplify, delete attend souvent { id }. Si ton pivot n'a pas d'id dédié,
    // tu émules un delete par composite en retrouvant l'id avant.
    delete: (args: Record<string, unknown>) => Promise<{ data: BaseModel<K> }>;
    update?: (data: Record<string, unknown>) => Promise<{ data: BaseModel<K> }>; // ← optionnel
    list: (args?: { filter?: Record<string, unknown> }) => Promise<{ data: BaseModel<K>[] }>;
}

function getRelationClient<K extends ModelClientKey>(key: K): RelationCrudModel<K> {
    return client.models[key] as unknown as RelationCrudModel<K>;
}

const READ: Operation = "read";
const CREATE: Operation = "create";
const UPDATE: Operation = "update";
const DELETE: Operation = "delete";

/**
 * Service générique pour tables pivot/relations Many-to-Many (ou équivalents).
 * parentIdKey/childIdKey = noms de colonnes dans le pivot (ex: "postId", "tagId").
 */
export function relationService<
    K extends ModelClientKey,
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
            // On retrouve l’enregistrement pivot existant
            const { data: current } = await model.list({
                filter: { [parentIdKey]: { eq: parentId }, [childIdKey]: { eq: childId } },
            });

            // Vérif d’accès DELETE
            const allowed =
                current[0] &&
                canAccessOp(user, current[0] as Record<string, unknown>, rules, DELETE);
            if (!allowed) throw new Error("Not authorized (delete)");

            // Si l’API delete attend { id }, récupère l’id ici :
            // const id = (current[0] as Record<string, unknown>)["id"];
            // await model.delete({ id });

            // Si ton client supporte la suppression par composite :
            await model.delete({
                [parentIdKey]: parentId,
                [childIdKey]: childId,
            });
        },

        // OPTIONNEL : "update" sur pivot (rare; en général on fait delete+create)
        async update(
            parentId: string,
            childId: string,
            patch: Partial<Record<ParentIdKey | ChildIdKey, string>>
        ) {
            if (!model.update) {
                // Fallback : delete + create si pas d'update natif
                if (patch[parentIdKey] || patch[childIdKey]) {
                    await this.delete(parentId, childId);
                    await this.create(
                        (patch[parentIdKey] as string) ?? parentId,
                        (patch[childIdKey] as string) ?? childId
                    );
                    return;
                }
                return;
            }

            const { data: current } = await model.list({
                filter: { [parentIdKey]: { eq: parentId }, [childIdKey]: { eq: childId } },
            });
            const row = current[0];
            if (!row) return;

            const allowed = canAccessOp(user, row as Record<string, unknown>, rules, UPDATE);
            if (!allowed) throw new Error("Not authorized (update)");

            // Idem : si l’API update attend { id }, on le passe :
            // const id = (row as Record<string, unknown>)["id"];
            // await model.update({ id, ...patch });

            // Si update par composite autorisé :
            await model.update?.({
                [parentIdKey]: parentId,
                [childIdKey]: childId,
                ...patch,
            });
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
