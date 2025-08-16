// src/app/profile/UserNameManager.tsx
"use client";
import { useEffect } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import EntityEditor from "@components/forms/EntityEditor";
import { label as fieldLabel } from "./utilsUserName";
import PersonIcon from "@mui/icons-material/Person";
import { useUserNameForm } from "@entities/models/userName/hooks";
import {
    type UserNameFormType,
    type UserNameTypeUpdateInput,
} from "@entities/models/userName/types";

const fields: (keyof UserNameFormType)[] = ["userName"];

export default function UserNameManager() {
    const { user } = useAuthenticator();
    const manager = useUserNameForm();

    useEffect(() => {
        if (user) {
            void manager.refresh(); // 🔄 charge/rafraîchit au montage et quand l'user change
        }
    }, [user, manager.refresh]);

    if (!user) return <Authenticator />;

    return (
        <EntityEditor<UserNameFormType>
            title="Mon pseudo public"
            requiredFields={["userName"]}
            deleteLabel="Supprimer le pseudo"
            renderIcon={() => <PersonIcon fontSize="small" className="text-gray-800" />}
            onClearField={(field, clear) => {
                if (
                    confirm(
                        `Supprimer le contenu du champ "${fieldLabel(
                            field as keyof UserNameTypeUpdateInput
                        )}" ?`
                    )
                ) {
                    void clear(field);
                }
            }}
            form={manager.form}
            mode={manager.mode}
            dirty={manager.dirty}
            handleChange={
                manager.handleChange as (field: keyof UserNameFormType, value: unknown) => void
            }
            submit={manager.submit} // ⬅️ version qui refetch
            reset={manager.reset}
            setForm={manager.setForm}
            fields={fields}
            labels={fieldLabel as (field: keyof UserNameFormType) => string}
            saveField={manager.saveField} // ⬅️ refetch inclus
            clearField={manager.clearField}
            deleteEntity={manager.remove} // ⬅️ refetch inclus
        />
    );
}
