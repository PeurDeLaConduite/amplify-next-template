import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);
const client = generateClient<Schema>();

type CommentWithTodoId = {
    id: string;
    content?: string | null;
    createdAt: string;
    todoId?: string;
};

export default function TodosWithCommentsPage() {
    const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);
    const [comments, setComments] = useState<CommentWithTodoId[]>([]);
    function listTodos() {
        client.models.Todo.observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });
    }
    function listComment() {
        client.models.Comment.observeQuery().subscribe({
            next: (data) => setComments([...(data.items as CommentWithTodoId[])]),
        });
    }
    useEffect(() => {
        return () => {
            listTodos();
            listComment();
        };
    }, []);

    // CRUD handlers
    const createTodo = () => {
        const content = window.prompt("Contenu du Todo ?");
        if (content) client.models.Todo.create({ content });
    };

    const deleteTodo = (id: string) => {
        if (confirm("Supprimer ce Todo ?")) {
            client.models.Todo.delete({ id });
        }
    };

    const addComment = (todoId: string) => {
        const content = window.prompt("Contenu du commentaire ?");
        if (content) client.models.Comment.create({ content, todoId });
    };

    const deleteComment = (id: string) => {
        if (confirm("Supprimer ce commentaire ?")) {
            client.models.Comment.delete({ id });
        }
    };

    return (
        <main>
            <button onClick={createTodo}>➕ Ajouter un Todo</button>
            <TodoList
                todos={todos}
                comments={comments}
                onDeleteTodo={deleteTodo}
                onAddComment={addComment}
                onDeleteComment={deleteComment}
            />
        </main>
    );
}

// Composant d'affichage des todos
interface TodoListProps {
    todos: Schema["Todo"]["type"][];
    comments: CommentWithTodoId[];
    onDeleteTodo: (id: string) => void;
    onAddComment: (todoId: string) => void;
    onDeleteComment: (id: string) => void;
}

function TodoList({ todos, comments, onDeleteTodo, onAddComment, onDeleteComment }: TodoListProps) {
    return (
        <ul>
            {todos.map((todo) => {
                const todoComments = comments.filter((c) => c.todoId === todo.id);
                return (
                    <li key={todo.id} style={{ marginBottom: "1rem" }}>
                        <strong>{todo.content}</strong>
                        <br />
                        <button onClick={() => onDeleteTodo(todo.id)}>🗑️ Supprimer</button>
                        <button onClick={() => onAddComment(todo.id)}>
                            💬 Ajouter un commentaire
                        </button>

                        {todoComments.length > 0 && (
                            <CommentList
                                comments={todoComments}
                                onDeleteComment={onDeleteComment}
                            />
                        )}
                    </li>
                );
            })}
        </ul>
    );
}

// Composant de gestion et affichage des commentaires
interface CommentListProps {
    comments: CommentWithTodoId[];
    onDeleteComment: (id: string) => void;
}

function CommentList({ comments, onDeleteComment }: CommentListProps) {
    return (
        <ul style={{ paddingLeft: "1.5rem" }}>
            {comments.map((comment) => (
                <li key={comment.id} style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: "0.5rem" }}>{comment.content}</span>
                    <button onClick={() => onDeleteComment(comment.id)}>❌</button>
                </li>
            ))}
        </ul>
    );
}
