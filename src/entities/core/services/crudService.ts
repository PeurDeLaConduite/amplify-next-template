// src/entities/core/services/crudService.ts
import { client, Schema } from "./amplifyClient";
import { canAccess } from "../auth";
import type { EntitiesAuthRule } from "../types";

type ClientModels = typeof client.models;
type ClientModelKey = keyof ClientModels;
type BaseModel<K extends ClientModelKey> = Schema[K]["type"];

/** Infère le 1er argument d’une méthode seulement si la clé existe */
type MethodArg<T, M extends PropertyKey> = M extends keyof T
    ? T[M] extends (...args: infer P) => unknown
        ? P extends [infer A, ...unknown[]]
            ? A
            : never
        : never
    : never;

type DefaultCreateArg<K extends ClientModelKey> = MethodArg<ClientModels[K], "create">;
type DefaultUpdateArg<K extends ClientModelKey> = MethodArg<ClientModels[K], "update">;
type DefaultGetArg<K extends ClientModelKey> = MethodArg<ClientModels[K], "get">;
type DefaultDeleteArg<K extends ClientModelKey> = MethodArg<ClientModels[K], "delete">;

export type AuthMode = "apiKey" | "userPool" | "identityPool" | "iam" | "lambda";
type CrudAuth = { read?: AuthMode | AuthMode[]; write?: AuthMode | AuthMode[] };
type AmplifyOpOptions = { authMode?: AuthMode } & Record<string, unknown>;

interface CrudModel<K extends ClientModelKey, C, U, G, D> {
    list: (opts?: AmplifyOpOptions) => Promise<{ data: BaseModel<K>[] }>;
    get: (args: G, opts?: AmplifyOpOptions) => Promise<{ data?: BaseModel<K> }>;
    create: (
        data: C,
        opts?: AmplifyOpOptions
    ) => Promise<{ data: BaseModel<K>; errors?: { message: string }[] }>;
    update: (
        data: U,
        opts?: AmplifyOpOptions
    ) => Promise<{ data: BaseModel<K>; errors?: { message: string }[] }>;
    delete: (
        args: D,
        opts?: AmplifyOpOptions
    ) => Promise<{ data: BaseModel<K>; errors?: { message: string }[] }>;
}

function getModelClient<K extends ClientModelKey, C, U, G, D>(key: K): CrudModel<K, C, U, G, D> {
    return client.models[key] as unknown as CrudModel<K, C, U, G, D>;
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
 * CRUD générique
 * - par défaut, on infère depuis le client Amplify
 * - si ça “tombe à never” sur un modèle, tu peux SURCHARGER C/U/G/D au call-site
 */
export function crudService<
    K extends ClientModelKey,
    C = DefaultCreateArg<K>,
    U = DefaultUpdateArg<K>,
    G = DefaultGetArg<K>,
    D = DefaultDeleteArg<K>,
>(key: K, opts?: { auth?: CrudAuth; rules?: EntitiesAuthRule[] }) {
    const model = getModelClient<K, C, U, G, D>(key);
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
                    args,
                    (authMode ? { authMode } : undefined) as AmplifyOpOptions | undefined
                )
            );
            if (res.data && !canAccess(null, res.data, rules)) return { data: undefined };
            return res;
        },

        async create(data: C) {
            return tryModes(writeModes, (authMode) =>
                model.create(
                    data,
                    (authMode ? { authMode } : undefined) as AmplifyOpOptions | undefined
                )
            );
        },

        async update(data: U) {
            return tryModes(writeModes, (authMode) =>
                model.update(
                    data,
                    (authMode ? { authMode } : undefined) as AmplifyOpOptions | undefined
                )
            );
        },

        async delete(args: D) {
            return tryModes(writeModes, (authMode) =>
                model.delete(
                    args,
                    (authMode ? { authMode } : undefined) as AmplifyOpOptions | undefined
                )
            );
        },
    };
}
