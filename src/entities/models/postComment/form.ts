// AUTO-GENERATED – DO NOT EDIT
import type { PostCommentType, PostCommentFormType, PostCommentCreateOmit } from "./types";
import { createModelForm } from "@/src/entities/core/utils/createModelForm";

export const initialPostCommentForm: PostCommentFormType = {
    id: "",
    content: "",
    owner: "",
    postId: "",
    userNameId: "",
};

function toPostCommentForm(model: PostCommentType): PostCommentFormType {
    return {
        content: model.content ?? "",
        owner: model.owner ?? "",
        postId: model.postId ?? "",
        userNameId: model.userNameId ?? "",
    };
}

function toPostCommentInput(form: PostCommentFormType): PostCommentCreateOmit {
    return form as PostCommentCreateOmit;
}

export const postCommentForm = createModelForm<
    PostCommentType,
    PostCommentFormType,
    [],
    PostCommentCreateOmit
>(initialPostCommentForm, (model) => toPostCommentForm(model), toPostCommentInput);

export { toPostCommentForm, toPostCommentInput };
