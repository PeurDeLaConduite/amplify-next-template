import React from "react";
import "@aws-amplify/ui-react/styles.css";
import useTodosWithComments from "@/src/components/todo/useTodosWithComments";
import TodoList from "@/src/components/todo/TodoList";

export default function TodosWithCommentsPage() {
    const {
        todos,
        comments,
        createTodo,
        addComment,
        enterEditMode,
        deleteForm,
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
                enterEditMode={enterEditMode}
                deleteForm={deleteForm}
                canModify={canModifyComment}
            />
        </section>
    );
}
