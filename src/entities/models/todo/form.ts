// AUTO-GENERATED – DO NOT EDIT
import type { TodoType, TodoFormType, TodoCreateInput } from "./types";
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

function toTodoInput(form: TodoFormType): TodoCreateInput {
  return form as TodoCreateInput;
}

export const todoForm = createModelForm<TodoType, TodoFormType, [], TodoCreateInput>(
  initialTodoForm,
  (model) => toTodoForm(model),
  toTodoInput
);

export { toTodoForm, toTodoInput };
