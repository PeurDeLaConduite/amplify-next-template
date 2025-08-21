import { useCallback, useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { getUserSub } from "@src/entities/core/auth";

export function useCommentPermissions() {
    const [userId, setUserId] = useState<string | null>(null);
    const [groups, setGroups] = useState<string[]>([]);

    useEffect(() => {
        void (async () => {
            try {
                const userId = await getUserSub();
                setUserId(userId);
            } catch {
                setUserId(null);
            }
            try {
                const session = await fetchAuthSession();
                const payload = session.tokens?.accessToken?.payload;
                const g = payload ? (payload["cognito:groups"] as string[] | undefined) : undefined;
                setGroups(g ?? []);
            } catch {
                setGroups([]);
            }
        })();
    }, []);

    const isAdmin = groups.includes("ADMINS");
    const canModifyComment = useCallback(
        (ownerId?: string | null) => isAdmin || (!!ownerId && ownerId === userId),
        [isAdmin, userId]
    );

    return { userId, groups, isAdmin, canModifyComment };
}
