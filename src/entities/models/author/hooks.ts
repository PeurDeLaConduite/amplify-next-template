// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@entities/core/createEntityHooks";
import type { AuthorFormType } from "./types";
import { authorConfig } from "./config";
import { authorService } from "./service";

const useAuthorBase = createEntityHooks<AuthorFormType>({
    ...authorConfig,
    service: authorService,
});

export const useAuthorManager = useAuthorBase;

export const useAuthorForm = () => {
    const {
        form,
        mode,
        dirty,
        reset,
        submit,
        refresh,
        setForm,
        handleChange,
        fields,
        labels,
        saveField,
        clearField,
        remove,
        loading,
        error,
    } = useAuthorBase();
    return {
        form,
        mode,
        dirty,
        reset,
        submit,
        refresh,
        setForm,
        handleChange,
        fields,
        labels,
        saveField,
        clearField,
        remove,
        loading,
        error,
    } as const;
};
