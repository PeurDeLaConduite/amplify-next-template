// AUTO-GENERATED – DO NOT EDIT
import type { TodoType, TodoFormType } from "./types";
import { type ModelForm, createModelForm } from "@src/entities/core/createModelForm";


export const initialTodoForm: TodoFormType = {
  id: "",
  content: "",
};

function toTodoForm(model: TodoType): TodoFormType {
  return {
  id: model.id ?? "",
  content: model.content ?? "",
  };
}

export const todoForm = createModelForm<TodoType, TodoFormType, []>(
  initialTodoForm,
  (model) => toTodoForm(model)
);

export { toTodoForm };
