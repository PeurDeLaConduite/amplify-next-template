// AUTO-GENERATED – DO NOT EDIT
    import type { PostCommentType, PostCommentFormType, PostCommentTypeOmit } from "./types";
    import { createModelForm } from "@src/entities/core/createModelForm";
    
    
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
    
    function toPostCommentInput(form: PostCommentFormType): PostCommentTypeOmit {
      return form as PostCommentTypeOmit;
    }
    
    export const postCommentForm = createModelForm<PostCommentType, PostCommentFormType, [], PostCommentTypeOmit>(
      initialPostCommentForm,
      (model) => toPostCommentForm(model),
      toPostCommentInput
    );
    
    export { toPostCommentForm, toPostCommentInput };
    