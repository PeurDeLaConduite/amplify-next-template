// AUTO-GENERATED – DO NOT EDIT
import type { PostCommentType, PostCommentFormType, PostCommentCreateInput } from "./types";
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
  content: model.content ?? "",
  owner: model.owner ?? "",
  postId: model.postId ?? "",
  userNameId: model.userNameId ?? "",
  };
}

function toPostCommentInput(form: PostCommentFormType): PostCommentCreateInput {
  return form as PostCommentCreateInput;
}

export const postCommentForm = createModelForm<PostCommentType, PostCommentFormType, [], PostCommentCreateInput>(
  initialPostCommentForm,
  (model) => toPostCommentForm(model),
  toPostCommentInput
);

export { toPostCommentForm, toPostCommentInput };
