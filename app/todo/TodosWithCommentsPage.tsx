import React from "react";
import "@aws-amplify/ui-react/styles.css";
import useTodosWithComments from "@src/features/todo/useTodosWithComments";
import TodoList from "@src/features/todo/TodoList";

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
            <button
                onClick={createTodo}
                className="mb-8 w-full sm:w-auto px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition focus:ring-2 focus:ring-blue-300 focus:outline-none"
            >
                ➕ Ajouter un Todo
            </button>
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
