"use client";
import { useEffect } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import EntitySection from "./shared/EntitySection";
import { label as fieldLabel } from "./utilsUserName";
import PersonIcon from "@mui/icons-material/Person";
import { useUserNameManager } from "@entities/models/userName/hooks";
import { type UserNameMinimalType } from "@entities/models/userName/types";

export default function UserNameManager() {
    const { user } = useAuthenticator();
    const manager = useUserNameManager();

    useEffect(() => {
        if (user) {
            manager.fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (!user) return <Authenticator />;

    return (
        <EntitySection<UserNameMinimalType>
            title="Mon pseudo public"
            manager={manager}
            requiredFields={["userName"]}
            deleteLabel="Supprimer le pseudo"
            renderIcon={() => <PersonIcon fontSize="small" className="text-gray-800" />}
            onClearField={(field, clear) => {
                if (confirm(`Supprimer le contenu du champ "${fieldLabel(field)}" ?`)) {
                    void clear(field);
                }
            }}
        />
    );
}
