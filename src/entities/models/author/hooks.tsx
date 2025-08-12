import { useEntityManager, type FieldConfig } from "@entities/core/hooks";
import { authorService } from "@entities/models/author/service";
import {
    initialAuthorForm,
    toAuthorForm,
    toAuthorCreate,
    toAuthorUpdate,
} from "@entities/models/author/form";
import type { AuthorFormType } from "@entities/models/author/types";

export function useAuthorForm(id?: string) {
    const fieldConfig: FieldConfig<AuthorFormType> = Object.keys(initialAuthorForm).reduce(
        (acc, key) => ({
            ...acc,
            [key]: {
                parse: (v) => v as AuthorFormType[keyof AuthorFormType],
                serialize: (v) => v as unknown,
                emptyValue: initialAuthorForm[key as keyof AuthorFormType],
            },
        }),
        {} as FieldConfig<AuthorFormType>
    );

    const fetch = async () => {
        if (!id) return null;
        const { data } = await authorService.get({ id });
        if (!data) return null;
        return { id, ...toAuthorForm(data, []) };
    };

    const create = async (form: AuthorFormType) => {
        await authorService.create(toAuthorCreate(form));
    };

    const update = async (
        entity: (AuthorFormType & { id?: string }) | null,
        form: AuthorFormType
    ) => {
        if (!entity?.id) return;
        await authorService.update({ id: entity.id, ...toAuthorUpdate(form) });
    };

    const remove = async (entity: (AuthorFormType & { id?: string }) | null) => {
        if (!entity?.id) return;
        await authorService.delete({ id: entity.id });
    };

    const manager = useEntityManager<AuthorFormType>({
        fetch,
        create,
        update,
        remove,
        labels: (f) => f,
        fields: Object.keys(initialAuthorForm) as (keyof AuthorFormType)[],
        initialData: initialAuthorForm,
        config: fieldConfig,
    });

    return {
        form: manager.formData,
        loading: manager.loading,
        save: manager.save,
        delete: manager.deleteEntity,
    };
}
