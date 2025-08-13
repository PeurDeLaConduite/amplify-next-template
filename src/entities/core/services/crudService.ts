// src/entities/core/services/crudService.ts
import { client } from "./amplifyClient";
import type {
    AuthRule,
    AuthUser,
    Operation,
    ModelKey,
    BaseModel,
    CreateData,
    UpdateDataWithId,
} from "@entities/core/types";
import { canAccessOp } from "../auth";

// Clé client (doit coïncider avec ModelKey)
type ClientModelKey = keyof typeof client.models;
// On force K à exister dans les deux espaces (Schema et client.models)
type ModelClientKey = ClientModelKey & ModelKey;

interface CrudModel<K extends ClientModelKey> {
    list: () => Promise<{ data: BaseModel<K>[] }>;
    get: (args: { id: string }) => Promise<{ data?: BaseModel<K> }>;
    create: (
        data: Partial<CreateData<K>>
    ) => Promise<{ data: BaseModel<K>; errors?: { message: string }[] }>;
    update: (
        data: UpdateDataWithId<K>
    ) => Promise<{ data: BaseModel<K>; errors?: { message: string }[] }>;
    delete: (args: {
        id: string;
    }) => Promise<{ data: BaseModel<K>; errors?: { message: string }[] }>;
}

function getModelClient<K extends ClientModelKey>(key: K): CrudModel<K> {
    return client.models[key] as unknown as CrudModel<K>;
}

type CrudOptions = {
    /** Injecte automatiquement l'owner à la création si absent (ex: "owner") */
    autoOwnerField?: string;
};

const READ: Operation = "read";
const CREATE: Operation = "create";
const UPDATE: Operation = "update";
const DELETE: Operation = "delete";

/** CRUD générique pour modèles Amplify (pas pour customTypes) */
export function crudService<K extends ModelClientKey>(
    key: K,
    user: AuthUser | null,
    rules: AuthRule[],
    opts: CrudOptions = {}
) {
    const model = getModelClient(key);

    return {
        async list() {
            const { data } = await model.list();
            return {
                data: data.filter((item) =>
                    canAccessOp(user, item as Record<string, unknown>, rules, READ)
                ),
            };
        },

        async get(args: { id: string }) {
            const res = await model.get(args);
            if (!res.data) return { data: undefined };
            const ok = canAccessOp(user, res.data as Record<string, unknown>, rules, READ);
            return ok ? res : { data: undefined };
        },

        async create(data: Partial<CreateData<K>>) {
            if (
                opts.autoOwnerField &&
                user?.username &&
                data[opts.autoOwnerField as keyof typeof data] == null
            ) {
                (data as Record<string, unknown>)[opts.autoOwnerField] = user.username;
            }
            if (!canAccessOp(user, data as Record<string, unknown>, rules, CREATE)) {
                throw new Error("Not authorized (create)");
            }
            return model.create(data);
        },

        async update(data: UpdateDataWithId<K>) {
            const current = await model.get({ id: data.id });
            const allowed =
                current.data &&
                canAccessOp(user, current.data as Record<string, unknown>, rules, UPDATE);
            if (!allowed) throw new Error("Not authorized (update)");
            return model.update(data);
        },

        async delete(args: { id: string }) {
            const current = await model.get({ id: args.id });
            const allowed =
                current.data &&
                canAccessOp(user, current.data as Record<string, unknown>, rules, DELETE);
            if (!allowed) throw new Error("Not authorized (delete)");
            return model.delete(args);
        },
    };
}
