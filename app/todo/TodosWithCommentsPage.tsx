import React from "react";
import "@aws-amplify/ui-react/styles.css";
import useTodosWithComments from "@/src/components/todo/useTodosWithComments";
import TodoList from "@/src/components/todo/TodoList";
import { AddButton } from "@/src/components/buttons/Buttons";

export default function TodosWithCommentsPage() {
    const {
        todos,
        comments,
        createTodo,
        addComment,
        editComment,
        deleteComment,
        deleteTodo,
        canModifyComment,
    } = useTodosWithComments();

    return (
        <section className="py-4">
            <AddButton
                onClick={createTodo}
                label="Ajouter un Todo"
                className="mb-8 w-full sm:w-auto"
            />
            <TodoList
                todos={todos}
                comments={comments}
                onDeleteTodo={deleteTodo}
                onAddComment={addComment}
                onEditComment={editComment}
                onDeleteComment={deleteComment}
                canModify={canModifyComment}
            />
        </section>
    );
}
