// src/entities/core/services/crudService.ts
import { client, Schema } from "./amplifyClient";
import { canAccess } from "../auth";
import type { AuthRule } from "../types";

// ── Clés & base model ───────────────────────────────────────────────────────────
type ClientModels = typeof client.models;

// ⚠️ Ici Schema n'a pas "types", donc on utilise ses clés top-level
type SchemaModelName = keyof Schema; // ex: "Post" | "Tag" | ...
type ModelKey = Extract<keyof ClientModels, SchemaModelName>; // intersection stricte

type BaseModel<K extends ModelKey> = Schema[K]["type"];

// ── Extraction des args par opération (sans indexer par un M générique) ─────────
type CreateArg<K extends ModelKey> = ClientModels[K] extends {
    create: (arg: infer A, ...r: unknown[]) => unknown;
}
    ? A
    : never;

type UpdateArg<K extends ModelKey> = ClientModels[K] extends {
    update: (arg: infer A, ...r: unknown[]) => unknown;
}
    ? A
    : never;

type GetArg<K extends ModelKey> = ClientModels[K] extends {
    get: (arg: infer A, ...r: unknown[]) => unknown;
}
    ? A
    : never;

type DeleteArg<K extends ModelKey> = ClientModels[K] extends {
    delete: (arg: infer A, ...r: unknown[]) => unknown;
}
    ? A
    : never;

// ── Options & façade CRUD ───────────────────────────────────────────────────────
export type AuthMode = "apiKey" | "userPool" | "identityPool" | "iam" | "lambda";

/**
 * Modes d'authentification utilisés pour les opérations CRUD.
 * - `read` : modes testés pour les lectures (par défaut `userPool` puis `apiKey`).
 * - `write` : modes testés pour les écritures.
 */
type CrudAuth = { read?: AuthMode | AuthMode[]; write?: AuthMode | AuthMode[] };

type AmplifyOpOptions = {
    authMode?: AuthMode;
    selectionSet?: string | string[];
} & Record<string, unknown>;

interface CrudModel<K extends ModelKey> {
    list: (opts?: AmplifyOpOptions) => Promise<{ data: BaseModel<K>[]; nextToken?: string }>;
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

function getModelClient<K extends ModelKey>(key: K): CrudModel<K> {
    return client.models[key] as unknown as CrudModel<K>;
}

function toArray<T>(v?: T | T[]): T[] {
    return v === undefined ? [] : Array.isArray(v) ? v : [v];
}

/**
 * Tente d'exécuter l'opération avec différents modes d'authentification
 * jusqu'à succès ou épuisement des modes fournis.
 */
export async function withAuthFallback<T>(
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
    K extends ModelKey,
    C = CreateArg<K>,
    U = UpdateArg<K>,
    G = GetArg<K>,
    D = DeleteArg<K>,
>(key: K, opts?: { auth?: CrudAuth; rules?: AuthRule[] }) {
    const model = getModelClient(key);
    const rules = opts?.rules ?? [{ allow: "public" }];
    const readModes = toArray(opts?.auth?.read);
    const writeModes = toArray(opts?.auth?.write);
    const effectiveReadModes = readModes.length ? readModes : ["userPool", "apiKey"];

    return {
        async list(
            params?: Record<string, unknown>,
            selectionSet?: AmplifyOpOptions["selectionSet"]
        ) {
            const { data, nextToken } = await withAuthFallback(effectiveReadModes, (authMode) =>
                model.list({
                    ...(params ?? {}),
                    ...(selectionSet ? { selectionSet } : {}),
                    ...(authMode ? { authMode } : {}),
                } as AmplifyOpOptions)
            );
            return {
                data: data.filter((item) => canAccess(null, item, rules)),
                nextToken,
            };
        },

        async get(args: G, selectionSet?: AmplifyOpOptions["selectionSet"]) {
            const res = await withAuthFallback(effectiveReadModes, (authMode) =>
                model.get(
                    args as GetArg<K>,
                    {
                        ...(selectionSet ? { selectionSet } : {}),
                        ...(authMode ? { authMode } : {}),
                    } as AmplifyOpOptions
                )
            );
            if (res.data && !canAccess(null, res.data, rules)) return { data: undefined };
            return res;
        },

        async create(data: C) {
            return withAuthFallback(writeModes, (authMode) =>
                model.create(
                    data as CreateArg<K>,
                    (authMode ? { authMode } : undefined) as AmplifyOpOptions | undefined
                )
            );
        },

        async update(data: U) {
            return withAuthFallback(writeModes, (authMode) =>
                model.update(
                    data as UpdateArg<K>,
                    (authMode ? { authMode } : undefined) as AmplifyOpOptions | undefined
                )
            );
        },

        async delete(args: D) {
            return withAuthFallback(writeModes, (authMode) =>
                model.delete(
                    args as DeleteArg<K>,
                    (authMode ? { authMode } : undefined) as AmplifyOpOptions | undefined
                )
            );
        },
    };
}
