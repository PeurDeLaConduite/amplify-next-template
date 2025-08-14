// src/entities/core/services/crudService.ts
import { client, Schema } from "./amplifyClient";
import { canAccess } from "../auth";
import type { AuthRule } from "../types";

// 🔧 Types dynamiques
type ClientModelKey = keyof typeof client.models;
type BaseModel<K extends ClientModelKey> = Schema[K]["type"];

// ⬇️ IMPORTANT: autoriser un `id` fourni au create (ex: id = sub)
//    et ignorer les timestamps gérés par le backend.
type WithoutTimestamps<T> = Omit<T, "createdAt" | "updatedAt">;
type CreateData<K extends ClientModelKey> = Partial<Pick<BaseModel<K>, "id">> &
    WithoutTimestamps<BaseModel<K>>;
type UpdateData<K extends ClientModelKey> = Partial<WithoutTimestamps<BaseModel<K>>> & {
    id: string;
};

// Modes d'auth usuels
export type AuthMode = "apiKey" | "userPool" | "identityPool" | "iam" | "lambda";

type CrudAuth = {
    read?: AuthMode | AuthMode[]; // list/get
    write?: AuthMode | AuthMode[]; // create/update/delete
};

// ✅ Options « sûres » pour les opérations Amplify
type AmplifyOpOptions = { authMode?: AuthMode } & Record<string, unknown>;

interface CrudModel<K extends ClientModelKey> {
    list: (opts?: AmplifyOpOptions) => Promise<{ data: BaseModel<K>[] }>;
    get: (args: { id: string }, opts?: AmplifyOpOptions) => Promise<{ data?: BaseModel<K> }>;
    create: (
        data: CreateData<K>,
        opts?: AmplifyOpOptions
    ) => Promise<{ data: BaseModel<K>; errors?: { message: string }[] }>;
    update: (
        data: UpdateData<K>,
        opts?: AmplifyOpOptions
    ) => Promise<{ data: BaseModel<K>; errors?: { message: string }[] }>;
    delete: (
        args: { id: string },
        opts?: AmplifyOpOptions
    ) => Promise<{ data: BaseModel<K>; errors?: { message: string }[] }>;
}

// ✅ Récupère le client typé
function getModelClient<K extends ClientModelKey>(key: K): CrudModel<K> {
    return client.models[key] as unknown as CrudModel<K>;
}

function toArray<T>(v?: T | T[]): T[] {
    return v === undefined ? [] : Array.isArray(v) ? v : [v];
}

async function tryModes<T>(
    modes: (AuthMode | undefined)[],
    runner: (mode?: AuthMode) => Promise<T>
): Promise<T> {
    let lastErr: unknown;
    for (const m of modes.length ? modes : [undefined]) {
        try {
            return await runner(m);
        } catch (e) {
            lastErr = e;
        }
    }
    throw lastErr;
}

/**
 * CRUD générique pour les *modèles* (❌ pas pour les customTypes).
 */
export function crudService<K extends ClientModelKey>(
    key: K,
    opts?: {
        auth?: CrudAuth; // ex: { read: ["apiKey","userPool"], write: "userPool" }
        rules?: AuthRule[]; // filtrage client via canAccess
    }
) {
    const model = getModelClient(key);
    const rules = opts?.rules ?? [{ allow: "public" }];

    const readModes = toArray(opts?.auth?.read);
    const writeModes = toArray(opts?.auth?.write);

    return {
        async list(params?: Record<string, unknown>) {
            const { data } = await tryModes(readModes, (authMode) =>
                model.list({
                    ...(params ?? {}),
                    ...(authMode ? { authMode } : {}),
                } as AmplifyOpOptions)
            );
            return { data: data.filter((item) => canAccess(null, item, rules)) };
        },

        async get(args: { id: string }) {
            const res = await tryModes(readModes, (authMode) =>
                model.get(
                    args,
                    (authMode ? { authMode } : undefined) as AmplifyOpOptions | undefined
                )
            );
            if (res.data && !canAccess(null, res.data, rules)) {
                return { data: undefined };
            }
            return res;
        },

        async create(data: CreateData<K>) {
            return tryModes(writeModes, (authMode) =>
                model.create(
                    data,
                    (authMode ? { authMode } : undefined) as AmplifyOpOptions | undefined
                )
            );
        },

        async update(data: UpdateData<K>) {
            return tryModes(writeModes, (authMode) =>
                model.update(
                    data,
                    (authMode ? { authMode } : undefined) as AmplifyOpOptions | undefined
                )
            );
        },

        async delete(args: { id: string }) {
            return tryModes(writeModes, (authMode) =>
                model.delete(
                    args,
                    (authMode ? { authMode } : undefined) as AmplifyOpOptions | undefined
                )
            );
        },
    };
}
