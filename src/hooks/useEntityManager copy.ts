import { useEffect, useState, useCallback } from "react";

export type FieldKey<T> = keyof T & string;

export interface UseEntityManagerOptions<T extends Record<string, string>> {
    fetch: () => Promise<(T & { id?: string }) | null>;
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
    const [loading, setLoading] = useState(true);

    // Fonction fetchData explicite
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetch(); // <--- C'est bien ta méthode get/unique
            setEntity(data);
            if (data && !editMode) {
                const next = { ...formData };
                fields.forEach((f) => {
                    next[f] = data[f] ?? "";
                });
                setFormData(next);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setEditMode(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetch, editMode, fields, formData]);

    // Chargement initial (et possible refresh)
    useEffect(() => {
        let cancelled = false;
        async function load() {
            await fetchData();
        }
        load();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchData]);

    // ...le reste inchangé
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((f) => ({ ...f, [name]: value }));
    };

    const save = async () => {
        setLoading(true);
        try {
            if (entity) {
                await update(entity, formData);
            } else {
                await create(formData);
            }

            // Optionnel : refresh après save si besoin
            // await fetchData();
        } finally {
            setLoading(false);
            setEditMode(false);
        }
    };

    const saveField = async () => {
        if (!editModeField) return;
        setLoading(true);
        try {
            const { field, value } = editModeField;
            await update(entity, { [field]: value });
            setFormData((f) => ({ ...f, [field]: value }));
            setEditModeField(null);
            // Optionnel : refresh après saveField si besoin
            // await fetchData();
        } finally {
            setLoading(false);
        }
    };

    const clearField = async (field: FieldKey<T>) => {
        setLoading(true);
        try {
            await update(entity, { [field]: "" });
            setFormData((f) => ({ ...f, [field]: "" }));
            // Optionnel : refresh après clearField si besoin
            // await fetchData();
        } finally {
            setLoading(false);
        }
    };

    const deleteEntity = async () => {
        setLoading(true);
        try {
            await remove(entity);
            setEntity(null);
            setFormData(initialData);
            setEditMode(false);
        } finally {
            setLoading(false);
        }
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
        loading,
        fetchData, // <-- expose la fonction si tu veux la déclencher à la main plus tard (ex: bouton refresh)
    };
}
