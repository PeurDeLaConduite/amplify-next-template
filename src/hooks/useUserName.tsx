import { useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export function useUserName() {
    const { user } = useAuthenticator();
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        if (!user) {
            setUserName("");
            return;
        }

        const fetchUserName = async () => {
            try {
                const { data } = await client.models.UserName.list({
                    filter: { id: { eq: user.userId } },
                    limit: 1,
                });
                setUserName(data?.[0]?.userName ?? "");
            } catch (err) {
                setUserName("");
                console.error(err);
            }
        };

        fetchUserName();
    }, [user]);

    return userName;
}
