// AUTO-GENERATED – DO NOT EDIT
import type { TodoType, TodoFormType, TodoCreateOmit } from "./types";
import { type ModelForm, createModelForm } from "@src/entities/core/createModelForm";


export const initialTodoForm: TodoFormType = {
  id: "",
  content: "",
};

function toTodoForm(model: TodoType): TodoFormType {
  return {
  content: model.content ?? "",
  };
}

function toTodoInput(form: TodoFormType): TodoCreateOmit {
  return form as TodoCreateOmit;
}

export const todoForm = createModelForm<TodoType, TodoFormType, [], TodoCreateOmit>(
  initialTodoForm,
  (model) => toTodoForm(model),
  toTodoInput
);

export { toTodoForm, toTodoInput };
