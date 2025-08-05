"use client";
import { useState } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import EditField from "./EditField";
import ReadOnlyView from "./ReadOnlyView";
import ProfileForm from "./ProfileForm";

import { createUserName, updateUserName, getUserName } from "@/src/services";

import PersonIcon from "@mui/icons-material/Person";
import useEntityManager from "./useEntityManager";
import { UserNameData, normalizeUserName, fieldLabel } from "./utilsUserName";
export default function UserNameManager() {
    /* ---------- hooks toujours dans le même ordre ---------- */
    const { user } = useAuthenticator();
    const sub = user?.username ?? null;
    const [loading, setLoading] = useState(true);
    const {
        entity,
        formData,
        setFormData,
        editModeField,
        setEditModeField,
        handleChange,
        save,
        saveField,
        labels,
        fields,
    } = useEntityManager<UserNameData>({
        fields: ["userName"],
        labels: fieldLabel,
        initialData: normalizeUserName(),
        fetch: (setData) => {
            if (!sub) {
                setLoading(false);
                return;
            }
            void getUserName(sub)
                .then((name) => {
                    setData(name ? { userName: name } : null);
                })
                .finally(() => setLoading(false));
        },
        create: async (data) => {
            if (!sub) return;
            await createUserName(sub, data.userName);
        },
        update: async (_entity, data) => {
            if (!sub) return;
            await updateUserName(sub, data.userName ?? "");
        },
        remove: async () => {
            if (!sub) return;
            await updateUserName(sub, "");
        },
    });

    if (!user) return <Authenticator />;

    return (
        <section className="w-full max-w-md mx-auto px-4 py-6 bg-white shadow rounded-lg mb-8">
            <h1 className="text-2xl font-bold text-center mb-6">Mon pseudo public</h1>

            {editModeField && (
                <EditField<UserNameData>
                    editModeField={editModeField}
                    setEditModeField={setEditModeField}
                    saveSingleField={saveField}
                    label={labels}
                />
            )}

            {entity === null && !editModeField && (
                <ProfileForm<UserNameData>
                    formData={formData}
                    fields={fields}
                    label={labels}
                    handleChange={handleChange}
                    handleSubmit={save}
                    isEdit={false}
                    onCancel={() => setFormData(normalizeUserName())}
                />
            )}

            {entity !== null && !editModeField && (
                <ReadOnlyView<UserNameData>
                    title="Mon pseudo public"
                    fields={fields}
                    data={formData}
                    label={labels}
                    onEditField={() =>
                        setEditModeField({ field: "userName", value: formData.userName })
                    }
                    renderIcon={() => <PersonIcon fontSize="small" className="text-gray-800" />}
                />
            )}

            {loading && <p className="text-center">Chargement…</p>}
        </section>
    );
}
