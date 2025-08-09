// AUTO-GENERATED – DO NOT EDIT
import type { CommentType, CommentFormType, CommentCreateInput } from "./types";
import { type ModelForm, createModelForm } from "@src/entities/core/createModelForm";


export const initialCommentForm: CommentFormType = {
  id: "",
  content: "",
  todoId: "",
  owner: "",
  userNameId: "",
};

function toCommentForm(model: CommentType): CommentFormType {
  return {
  content: model.content ?? "",
  todoId: model.todoId ?? "",
  owner: model.owner ?? "",
  userNameId: model.userNameId ?? "",
  };
}

function toCommentInput(form: CommentFormType): CommentCreateInput {
  return form as CommentCreateInput;
}

export const commentForm = createModelForm<CommentType, CommentFormType, [], CommentCreateInput>(
  initialCommentForm,
  (model) => toCommentForm(model),
  toCommentInput
);

export { toCommentForm, toCommentInput };
