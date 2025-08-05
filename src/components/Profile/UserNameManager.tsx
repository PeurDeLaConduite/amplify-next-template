"use client";
import { useState } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import EntitySection from "../shared/EntitySection";
import PersonIcon from "@mui/icons-material/Person";
import { createUserName, updateUserName, getUserName } from "@/src/services";
import { MinimalUserName as UserNameData, normalizeUserName, fieldLabel } from "./utilsUserName";

export default function UserNameManager() {
    const { user } = useAuthenticator();
    const sub = user?.username ?? null;
    const [loading, setLoading] = useState(true);
    if (!user) return <Authenticator />;

    return (
        <>
            <EntitySection<UserNameData>
                title="Mon pseudo public"
                fields={["userName"]}
                labels={fieldLabel}
                initialData={normalizeUserName()}
                fetch={(setData) => {
                    if (!sub) {
                        setLoading(false);
                        return;
                    }
                    void getUserName(sub)
                        .then((name) => {
                            setData(name ? { userName: name } : null);
                        })
                        .finally(() => setLoading(false));
                }}
                create={async (data) => {
                    if (!sub) return;
                    await createUserName(sub, data.userName);
                }}
                update={async (_entity, data) => {
                    if (!sub) return;
                    await updateUserName(sub, data.userName ?? "");
                }}
                remove={async () => {
                    if (!sub) return;
                    await updateUserName(sub, "");
                }}
                requiredFields={["userName"]}
                renderIcon={() => <PersonIcon fontSize="small" className="text-gray-800" />}
            />
            {loading && <p className="text-center">Chargement…</p>}
        </>
    );
}
