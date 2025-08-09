// AUTO-GENERATED – DO NOT EDIT
import type { CommentType, CommentFormType } from "./types";
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
  id: model.id ?? "",
  content: model.content ?? "",
  todoId: model.todoId ?? "",
  owner: model.owner ?? "",
  userNameId: model.userNameId ?? "",
  };
}

export const commentForm = createModelForm<CommentType, CommentFormType, []>(
  initialCommentForm,
  (model) => toCommentForm(model)
);

export { toCommentForm };
