import { getCurrentUser } from "aws-amplify/auth";

export async function getUserSub(): Promise<string> {
    const { userId } = await getCurrentUser();
    return userId;
}
