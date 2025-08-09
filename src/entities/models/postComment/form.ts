// AUTO-GENERATED – DO NOT EDIT
import type { PostCommentType, PostCommentFormType } from "./types";
import { type ModelForm, createModelForm } from "@src/entities/core/createModelForm";


export const initialPostCommentForm: PostCommentFormType = {
  id: "",
  content: "",
  owner: "",
  postId: "",
  userNameId: "",
};

function toPostCommentForm(model: PostCommentType): PostCommentFormType {
  return {
  id: model.id ?? "",
  content: model.content ?? "",
  owner: model.owner ?? "",
  postId: model.postId ?? "",
  userNameId: model.userNameId ?? "",
  };
}

export const postCommentForm = createModelForm<PostCommentType, PostCommentFormType, []>(
  initialPostCommentForm,
  (model) => toPostCommentForm(model)
);

export { toPostCommentForm };
