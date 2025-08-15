// AUTO-GENERATED – DO NOT EDIT
    import type { CommentType, CommentFormType, CommentTypeOmit } from "./types";
    import { createModelForm } from "@src/entities/core";
    
    
    export const initialCommentForm: CommentFormType = {
      id: "",
  content: "",
  todoId: "",
  postId: "",
  userNameId: "",
    };
    
    function toCommentForm(model: CommentType): CommentFormType {
      return {
      content: model.content ?? "",
  todoId: model.todoId ?? "",
  postId: model.postId ?? "",
  userNameId: model.userNameId ?? "",
      };
    }
    
    function toCommentInput(form: CommentFormType): CommentTypeOmit {
      return form as CommentTypeOmit;
    }
    
    export const commentForm = createModelForm<CommentType, CommentFormType, [], CommentTypeOmit>(
      initialCommentForm,
      (model) => toCommentForm(model),
      toCommentInput
    );
    
    export { toCommentForm, toCommentInput };
    