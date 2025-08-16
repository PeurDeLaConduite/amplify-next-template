import { useEffect, useState } from "react";
import type { Schema } from "@/amplify/data/resource";
import { getCurrentUser } from "aws-amplify/auth";
import { useTodoService, todoService } from "@src/entities/models/todo";
import { useCommentService, commentService } from "@src/entities/models/comment";
import { useCommentPermissions } from "@src/hooks/useCommentPermissions";

export type CommentWithTodoId = {
    id: string;
    content?: string | null;
    createdAt: string;
    todoId?: string;
    postId?: string;
    userNameId?: string;
    userName?: { userName?: string | null } | null;
};

export function useTodosWithComments() {
    const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);
    const [comments, setComments] = useState<CommentWithTodoId[]>([]);
    const todoClient = useTodoService();
    const commentClient = useCommentService();
    const { canModifyComment } = useCommentPermissions();

    useEffect(() => {
        const todoSub = todoClient.observeQuery().subscribe({
            next: ({ items }) => setTodos([...(items as Schema["Todo"]["type"][])]),
        });
        const commentSub = commentClient
            .observeQuery({
                selectionSet: [
                    "id",
                    "content",
                    "createdAt",
                    "todoId",
                    "postId",
                    "userNameId",
                    "userName.userName",
                ],
            })
            .subscribe({
                next: (data) => setComments([...(data.items as CommentWithTodoId[])]),
            });
        return () => {
            todoSub.unsubscribe();
            commentSub.unsubscribe();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const createTodo = () => {
        const content = window.prompt("Contenu du Todo ?");
        if (content) void todoService.create({ content });
    };

    const addComment = async (todoId: string) => {
        const content = window.prompt("Contenu du commentaire ?");
        if (!content) return;
        const { userId: userNameId } = await getCurrentUser();
        await commentService.create({ content, todoId, userNameId });
    };

    const editComment = async (id: string, ownerId?: string) => {
        if (!canModifyComment(ownerId)) return;
        const content = window.prompt("Modifier ce commentaire ?");
        if (!content) return;
        await commentService.update({ id, content });
    };

    const deleteComment = (id: string, ownerId?: string) => {
        if (!canModifyComment(ownerId)) return;
        if (confirm("Supprimer ce commentaire ?")) {
            void commentService.delete({ id });
        }
    };

    const deleteTodo = async (id: string) => {
        if (confirm("Supprimer ce Todo (et ses commentaires) ?")) {
            const { data: relatedComments } = await commentService.list({
                filter: { todoId: { eq: id } },
            });
            if (relatedComments) {
                for (const comment of relatedComments) {
                    await commentService.delete({ id: comment.id });
                }
            }
            await todoService.delete({ id });
        }
    };

    return {
        todos,
        comments,
        createTodo,
        addComment,
        editComment,
        deleteComment,
        deleteTodo,
        canModifyComment,
    };
}

export default useTodosWithComments;
