"use client";
import { useEffect } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import EntitySection from "./shared/EntitySection";
import PersonIcon from "@mui/icons-material/Person";
import { useUserNameManager } from "@src/entities";
import { MinimalUserName } from "./utilsUserName";

export default function UserNameManager() {
    const { user } = useAuthenticator();
    const baseManager = useUserNameManager();
    const manager = {
        ...baseManager,
        save: async () => {
            await baseManager.save();
            await baseManager.fetchData();
        },
        saveField: async () => {
            await baseManager.saveField();
            await baseManager.fetchData();
        },
    };

    useEffect(() => {
        if (user) {
            baseManager.fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (!user) return <Authenticator />;

    return (
        <EntitySection<MinimalUserName>
            title="Mon pseudo public"
            manager={manager}
            requiredFields={["userName"]}
            renderIcon={() => <PersonIcon fontSize="small" className="text-gray-800" />}
        />
    );
}
