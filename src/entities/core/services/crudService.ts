// src/entities/core/services/crudService.ts
import { client, Schema } from "./amplifyClient";
import { canAccess } from "../auth";
import type { AuthRule } from "../types";

// 🧠 Utiliser les signatures réelles du client Amplify
type ClientModels = typeof client.models;
type ClientModelKey = keyof ClientModels;

type BaseModel<K extends ClientModelKey> = Schema[K]["type"];
type CreateArg<K extends ClientModelKey> = Parameters<ClientModels[K]["create"]>[0];
type UpdateArg<K extends ClientModelKey> = Parameters<ClientModels[K]["update"]>[0];
type GetArg<K extends ClientModelKey> = Parameters<ClientModels[K]["get"]>[0];
type DeleteArg<K extends ClientModelKey> = Parameters<ClientModels[K]["delete"]>[0];

export type AuthMode = "apiKey" | "userPool" | "identityPool" | "iam" | "lambda";
type CrudAuth = { read?: AuthMode | AuthMode[]; write?: AuthMode | AuthMode[] };
type AmplifyOpOptions = { authMode?: AuthMode } & Record<string, unknown>;

interface CrudModel<K extends ClientModelKey> {
    list: (opts?: AmplifyOpOptions) => Promise<{ data: BaseModel<K>[] }>;
    get: (args: GetArg<K>, opts?: AmplifyOpOptions) => Promise<{ data?: BaseModel<K> }>;
    create: (
        data: CreateArg<K>,
        opts?: AmplifyOpOptions
    ) => Promise<{ data: BaseModel<K>; errors?: { message: string }[] }>;
    update: (
        data: UpdateArg<K>,
        opts?: AmplifyOpOptions
    ) => Promise<{ data: BaseModel<K>; errors?: { message: string }[] }>;
    delete: (
        args: DeleteArg<K>,
        opts?: AmplifyOpOptions
    ) => Promise<{ data: BaseModel<K>; errors?: { message: string }[] }>;
}

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

export function crudService<
    K extends ClientModelKey,
    C = CreateArg<K>,
    U = UpdateArg<K>,
    G = GetArg<K>,
    D = DeleteArg<K>,
>(key: K, opts?: { auth?: CrudAuth; rules?: AuthRule[] }) {
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

        async get(args: G) {
            const res = await tryModes(readModes, (authMode) =>
                model.get(
                    args as GetArg<K>,
                    (authMode ? { authMode } : undefined) as AmplifyOpOptions | undefined
                )
            );
            if (res.data && !canAccess(null, res.data, rules)) return { data: undefined };
            return res;
        },

        async create(data: C) {
            return tryModes(writeModes, (authMode) =>
                model.create(
                    data as CreateArg<K>,
                    (authMode ? { authMode } : undefined) as AmplifyOpOptions | undefined
                )
            );
        },

        async update(data: U) {
            return tryModes(writeModes, (authMode) =>
                model.update(
                    data as UpdateArg<K>,
                    (authMode ? { authMode } : undefined) as AmplifyOpOptions | undefined
                )
            );
        },

        async delete(args: D) {
            return tryModes(writeModes, (authMode) =>
                model.delete(
                    args as DeleteArg<K>,
                    (authMode ? { authMode } : undefined) as AmplifyOpOptions | undefined
                )
            );
        },
    };
}
