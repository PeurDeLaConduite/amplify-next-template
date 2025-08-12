// src/entities/core/services/crudService.ts
import { client, Schema } from "./amplifyClient";
import { canAccess, type AuthUser } from "../auth";
import type { AuthRule } from "../types";

// 🔧 Types dynamiques
type ClientModelKey = keyof typeof client.models;
type BaseModel<K extends ClientModelKey> = Schema[K]["type"];
type CreateData<K extends ClientModelKey> = Omit<BaseModel<K>, "id" | "createdAt" | "updatedAt">;
type UpdateData<K extends ClientModelKey> = Partial<CreateData<K>> & { id: string };

// ✅ Interface CRUD enrichie avec un champ `errors` optionnel
interface CrudModel<K extends ClientModelKey> {
    list: () => Promise<{ data: BaseModel<K>[] }>;
    get: (args: { id: string }) => Promise<{ data?: BaseModel<K> }>;
    create: (
        data: Partial<CreateData<K>>
    ) => Promise<{ data: BaseModel<K>; errors?: { message: string }[] }>;
    update: (
        data: UpdateData<K>
    ) => Promise<{ data: BaseModel<K>; errors?: { message: string }[] }>;
    delete: (args: {
        id: string;
    }) => Promise<{ data: BaseModel<K>; errors?: { message: string }[] }>;
}

// ✅ Récupère le client typé
function getModelClient<K extends ClientModelKey>(key: K): CrudModel<K> {
    return client.models[key] as unknown as CrudModel<K>;
}

/**
 * CRUD générique pour les *modèles* (❌ pas pour les customTypes).
 *
 * @param key Nom d’un modèle présent dans `client.models`.
 *            Les customTypes n’y figurent pas, donc TypeScript refusera "Seo", "Address", etc.
 */
export function crudService<K extends ClientModelKey>(
    key: K,
    user: AuthUser | null,
    rules: AuthRule[] = [{ allow: "public" }]
) {
    const model = getModelClient(key);
    return {
        async list() {
            const { data } = await model.list();
            return {
                data: data.filter((item) => canAccess(user, item, rules)),
            };
        },
        async get(args: { id: string }) {
            const res = await model.get(args);
            if (res.data && !canAccess(user, res.data, rules)) {
                return { data: undefined };
            }
            return res;
        },
        async create(data: Partial<CreateData<K>>) {
            if (!canAccess(user, data as Record<string, unknown>, rules)) {
                throw new Error("Not authorized");
            }
            return model.create(data);
        },
        async update(data: UpdateData<K>) {
            const current = await model.get({ id: data.id });
            if (current.data && !canAccess(user, current.data, rules)) {
                throw new Error("Not authorized");
            }
            return model.update(data);
        },
        async delete(args: { id: string }) {
            const current = await model.get({ id: args.id });
            if (current.data && !canAccess(user, current.data, rules)) {
                throw new Error("Not authorized");
            }
            return model.delete(args);
        },
    };
}
