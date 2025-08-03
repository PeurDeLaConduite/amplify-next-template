import { useState, useEffect, useCallback, type ChangeEvent } from "react";

export type CrudService<TEntity, TForm> = {
    list: () => Promise<{ data: TEntity[] }>;
    create: (input: Partial<TForm>) => Promise<{ data?: TEntity; errors?: any[] }>;
    update: (input: Partial<TForm> & { id: string }) => Promise<{ data?: TEntity; errors?: any[] }>;
    delete: (input: { id: string }) => Promise<{ data?: TEntity; errors?: any[] }>;
};

type CrudManagerOptions<TEntity, TForm> = {
    service: CrudService<TEntity, TForm>;
    initialForm: TForm;
    toForm: (entity: TEntity) => TForm;
    getId?: (entity: TEntity) => string;
    entityLabel?: string;
    onMessage?: (msg: string) => void;
};

export function useCrudManager<TEntity, TForm>({
    service,
    initialForm,
    toForm,
    getId = (entity: any) => entity.id,
    entityLabel = "cet élément",
    onMessage = (msg) => console.log(msg),
}: CrudManagerOptions<TEntity, TForm>) {
    const [entities, setEntities] = useState<TEntity[]>([]);
    const [form, setForm] = useState<TForm>(initialForm);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchEntities = useCallback(async () => {
        setLoading(true);
        const { data } = await service.list();
        setEntities(data ?? []);
        setLoading(false);
    }, [service]);

    useEffect(() => {
        void fetchEntities();
    }, [fetchEntities]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleEdit = (idx: number) => {
        setEditingIndex(idx);
        setForm(toForm(entities[idx]));
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setForm(initialForm);
    };

    const handleSave = async () => {
        try {
            if (editingIndex === null) {
                const result = await service.create(form);
                if (!result.data) throw new Error("Erreur à la création");
                onMessage(`${entityLabel} créé(e) !`);
            } else {
                const entity = entities[editingIndex];
                const result = await service.update({ id: getId(entity), ...form });
                if (!result.data) throw new Error("Erreur à la mise à jour");
                onMessage(`${entityLabel} mis(e) à jour !`);
            }
            await fetchEntities();
            handleCancel();
        } catch (err) {
            onMessage(err instanceof Error ? err.message : String(err));
        }
    };

    const handleDelete = async (idx: number) => {
        if (!window.confirm(`Supprimer ${entityLabel} ?`)) return;
        try {
            const entity = entities[idx];
            const result = await service.delete({ id: getId(entity) });
            if (!result.data) throw new Error("Erreur à la suppression");
            onMessage(`${entityLabel} supprimé(e) !`);
            await fetchEntities();
        } catch (err) {
            onMessage(err instanceof Error ? err.message : String(err));
        }
    };

    return {
        entities,
        form,
        setForm,
        editingIndex,
        loading,
        handleChange,
        handleEdit,
        handleCancel,
        handleSave,
        handleDelete,
        fetchEntities,
    };
}
