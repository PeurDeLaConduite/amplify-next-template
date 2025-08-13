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
} from "../types";
import { canAccessOp } from "../auth";

type ClientModelKey = keyof typeof client.models;
type ModelClientKey = ClientModelKey & ModelKey;

type ListArgs = { filter?: Record<string, unknown>; mine?: boolean };
type GetArgs = { id?: string; mine?: boolean };
type UpdateArgs<K extends ModelClientKey> =
    | (UpdateDataWithId<K> & { mine?: false })
    | ({ mine: true } & Partial<CreateData<K>>);
type DeleteArgs = { id?: string; mine?: boolean };

interface CrudModel<K extends ClientModelKey> {
    list: (args?: { filter?: Record<string, unknown> }) => Promise<{ data: BaseModel<K>[] }>;
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
    /** Active le scope "mine" (filtre owner=username) pour list/get/update/delete */
    ownerField?: string; // ex. "owner"
};

const READ: Operation = "read";
const CREATE: Operation = "create";
const UPDATE: Operation = "update";
const DELETE: Operation = "delete";

export function crudService<K extends ModelClientKey>(
    key: K,
    user: AuthUser | null,
    rules: AuthRule[],
    opts: CrudOptions = {}
) {
    const model = getModelClient(key);
    const ownerField = opts.ownerField ?? opts.autoOwnerField;

    const mergeFilter = (base?: Record<string, unknown>, extra?: Record<string, unknown>) =>
        base ? (extra ? { ...base, ...extra } : base) : (extra ?? undefined);

    async function findMineId(): Promise<string | undefined> {
        if (!ownerField || !user?.username) return;
        const { data } = await model.list({ filter: { [ownerField]: { eq: user.username } } });
        const first = data?.[0] as (BaseModel<K> & { id?: string }) | undefined;
        return first?.id;
    }

    return {
        /** LIST : list() | list({ mine: true, filter }) */
        async list(args?: ListArgs) {
            const mineFilter =
                args?.mine && ownerField && user?.username
                    ? { [ownerField]: { eq: user.username } }
                    : undefined;

            const { data } = await model.list({ filter: mergeFilter(args?.filter, mineFilter) });
            return {
                data: data.filter((item) =>
                    canAccessOp(user, item as Record<string, unknown>, rules, READ)
                ),
            };
        },

        /** GET : get({ id }) | get({ mine: true }) */
        async get(args?: GetArgs) {
            let id = args?.id;
            if (!id && args?.mine) id = await findMineId();
            if (!id) return { data: undefined as BaseModel<K> | undefined };

            const res = await model.get({ id });
            if (!res.data) return { data: undefined };
            const ok = canAccessOp(user, res.data as Record<string, unknown>, rules, READ);
            return ok ? res : { data: undefined };
        },

        /** CREATE : create(data) — owner auto-injecté si configuré */
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

        /** UPDATE :
         *  update({ id, ...patch })                 -> update par id
         *  update({ mine: true, ...partialCreate }) -> update de "mon" record (owner=username)
         */
        async update(patch: UpdateArgs<K>) {
            // Mine mode (sans id explicite)
            if ("mine" in patch && patch.mine) {
                const id = await findMineId();
                if (!id) throw new Error("Not found (mine)");
                const current = await model.get({ id });
                const allowed =
                    current.data &&
                    canAccessOp(user, current.data as Record<string, unknown>, rules, UPDATE);
                if (!allowed) throw new Error("Not authorized (update)");
                return model.update({
                    id,
                    ...(patch as Partial<CreateData<K>>),
                } as UpdateDataWithId<K>);
            }

            // Update par id explicite
            const current = await model.get({ id: (patch as UpdateDataWithId<K>).id });
            const allowed =
                current.data &&
                canAccessOp(user, current.data as Record<string, unknown>, rules, UPDATE);
            if (!allowed) throw new Error("Not authorized (update)");
            return model.update(patch as UpdateDataWithId<K>);
        },

        /** DELETE :
         *  delete({ id })       -> delete par id
         *  delete({ mine:true}) -> delete de "mon" record
         *  delete()             -> équivalent mine si ownerField configuré
         */
        async delete(args?: DeleteArgs) {
            let id = args?.id;
            if (!id && (args?.mine || (!args && ownerField))) {
                id = await findMineId();
                if (!id) return;
            }
            if (!id) return;

            const current = await model.get({ id });
            const allowed =
                current.data &&
                canAccessOp(user, current.data as Record<string, unknown>, rules, DELETE);
            if (!allowed) throw new Error("Not authorized (delete)");
            return model.delete({ id });
        },
    };
}
