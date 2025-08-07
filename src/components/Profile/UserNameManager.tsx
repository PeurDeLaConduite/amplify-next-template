"use client";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import EntitySection from "../shared/EntitySection";
import PersonIcon from "@mui/icons-material/Person";
import { useUserNameManager } from "@src/entities";

export default function UserNameManager() {
    const { user } = useAuthenticator();
    const manager = useUserNameManager();
    if (!user) return <Authenticator />;

    return (
        <EntitySection
            title="Mon pseudo public"
            requiredFields={["userName"]}
            renderIcon={() => <PersonIcon fontSize="small" className="text-gray-800" />}
            {...manager}
        />
    );
}
