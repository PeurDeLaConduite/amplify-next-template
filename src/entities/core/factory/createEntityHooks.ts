"use client";
import { useEffect } from "react";
import useModelForm, { type UseModelFormResult } from "@entities/core/hooks";

export interface EntityHookConfig<F, E, M = unknown> {
    initialForm: F;
    initialExtras?: E;
    toForm: (entity: M, ...args: any[]) => F;
    create: (form: F) => Promise<string>;
    update: (form: F, entity: M | null) => Promise<string>;
    syncRelations?: (id: string, form: F, entity: M | null) => Promise<void>;
    loadExtras?: () => Promise<Partial<E> | void> | Partial<E> | void;
    load?: (entity: M) => Promise<F> | F;
}

export default function createEntityHooks<F, E, M = unknown>(
    config: EntityHookConfig<F, E, M>
): (entity: M | null) => UseModelFormResult<F, E> {
    return function useEntityForm(entity: M | null) {
        const modelForm = useModelForm<F, E>({
            initialForm: config.initialForm,
            initialExtras: config.initialExtras,
            create: config.create,
            update: (form) => config.update(form, entity),
            syncRelations: config.syncRelations
                ? (id, form) => config.syncRelations!(id, form, entity)
                : undefined,
            loadExtras: config.loadExtras,
            load: entity && config.load ? () => config.load!(entity) : undefined,
            autoLoad: !!entity && !!config.load,
        });

        const { setForm, setMode } = modelForm;

        useEffect(() => {
            if (!config.load) {
                if (entity) {
                    setForm(config.toForm(entity));
                    setMode("edit");
                } else {
                    setForm(config.initialForm);
                    setMode("create");
                }
            }
        }, [entity, setForm, setMode]);

        return modelForm;
    };
}
