import { useEffect, useState } from "react";

export type FieldKey<T> = keyof T & string;

export interface UseEntityManagerOptions<T extends Record<string, string>> {
    fetch: (setData: (entity: (T & { id?: string }) | null) => void) => void | (() => void);
    create: (data: T) => Promise<void>;
    update: (entity: (T & { id?: string }) | null, data: Record<string, string>) => Promise<void>;
    remove: (entity: (T & { id?: string }) | null) => Promise<void>;
    labels: (field: FieldKey<T>) => string;
    fields: FieldKey<T>[];
    initialData: T;
}

export default function useEntityManager<T extends Record<string, string>>({
    fetch,
    create,
    update,
    remove,
    labels,
    fields,
    initialData,
}: UseEntityManagerOptions<T>) {
    const [entity, setEntity] = useState<(T & { id?: string }) | null>(null);
    const [formData, setFormData] = useState<T>(initialData);
    const [editMode, setEditMode] = useState(false);
    const [editModeField, setEditModeField] = useState<{
        field: FieldKey<T>;
        value: string;
    } | null>(null);

    useEffect(() => {
        const unsub = fetch((data) => {
            setEntity(data);
            if (data && !editMode) {
                const next = { ...formData };
                fields.forEach((f) => {
                    next[f] = data[f] ?? "";
                });
                setFormData(next);
            }
        });
        return unsub;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetch, editMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((f) => ({ ...f, [name]: value }));
    };

    const save = async () => {
        if (entity) {
            await update(entity, formData);
        } else {
            await create(formData);
        }
        setEditMode(false);
    };

    const saveField = async () => {
        if (!editModeField) return;
        const { field, value } = editModeField;
        await update(entity, { [field]: value });
        setFormData((f) => ({ ...f, [field]: value }));
        setEditModeField(null);
    };

    const clearField = async (field: FieldKey<T>) => {
        await update(entity, { [field]: "" });
        setFormData((f) => ({ ...f, [field]: "" }));
    };

    const deleteEntity = async () => {
        await remove(entity);
        setEntity(null);
        setFormData(initialData);
        setEditMode(false);
    };

    return {
        entity,
        formData,
        setFormData,
        editMode,
        setEditMode,
        editModeField,
        setEditModeField,
        handleChange,
        save,
        saveField,
        clearField,
        deleteEntity,
        labels,
        fields,
    };
}
