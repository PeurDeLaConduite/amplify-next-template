// AUTO-GENERATED – DO NOT EDIT
    import type { TodoType, TodoFormType, TodoTypeOmit } from "./types";
    import { createModelForm } from "@src/entities/core/createModelForm";
    
    
    export const initialTodoForm: TodoFormType = {
      id: "",
  content: "",
    };
    
    function toTodoForm(model: TodoType): TodoFormType {
      return {
      content: model.content ?? "",
      };
    }
    
    function toTodoInput(form: TodoFormType): TodoTypeOmit {
      return form as TodoTypeOmit;
    }
    
    export const todoForm = createModelForm<TodoType, TodoFormType, [], TodoTypeOmit>(
      initialTodoForm,
      (model) => toTodoForm(model),
      toTodoInput
    );
    
    export { toTodoForm, toTodoInput };
    