// @src/services/crudService.ts
import { client } from "./amplifyClient";
import type { Schema } from "@/amplify/data/resource";

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

// ✅ CRUD Service générique
export function crudService<K extends ClientModelKey>(key: K) {
    const model = getModelClient(key);
    return {
        list: model.list,
        get: model.get,
        create: model.create,
        update: model.update,
        delete: model.delete,
    };
}
