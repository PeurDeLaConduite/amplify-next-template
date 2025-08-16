// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@entities/core/createEntityHooks";
import type { CommentFormType } from "./types";
import { commentConfig } from "./config";
import { commentService } from "./service";

const useCommentBase = createEntityHooks<CommentFormType>({
    ...commentConfig,
    service: commentService,
});

export const useCommentManager = useCommentBase;

export const useCommentForm = () => {
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
    } = useCommentBase();
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
