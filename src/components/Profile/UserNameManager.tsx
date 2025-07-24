"use client";
import { useState, useEffect } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import EditSingleFieldUserName from "./EditSingleFieldUserName";
import ReadOnlyUserNameView from "./ReadOnlyUserNameView";
import ProfileForm from "./ProfileForm";

import { createUserName, updateUserName, getUserName } from "./userNameService";
// import { UserNameData, normalizeUserName, fieldLabel, type Profile } from "./utilsProfile";
import {
    UserNameData,
    SingleFieldUserName,
    normalizeUserName,
    userNameLabel,
} from "./utilsUserName";

export default function UserNameManager() {
    /* ---------- hooks toujours dans le même ordre ---------- */
    const { user } = useAuthenticator();
    const sub = user?.username ?? null; // string | null

    const [current, setCurrent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<UserNameData>(normalizeUserName);
    const [editModeField, setEditModeField] = useState<SingleFieldUserName | null>(null);

    /* ---------- charger le pseudo quand sub est connu ---------- */
    useEffect(() => {
        if (!sub) return; // pas encore authentifié
        setLoading(true);
        getUserName(sub)
            .then((name) => {
                setCurrent(name);
                setFormData({ userName: name ?? "" });
            })
            .finally(() => setLoading(false));
    }, [sub]);

    /* ---------- handlers ---------- */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ userName: e.target.value });

    const saveUserName = async (name: string) => {
        if (!sub) return; // sécurité
        if (current === null) {
            await createUserName(sub, name);
        } else {
            await updateUserName(sub, name);
        }
        setCurrent(name);
    };

    const saveProfileForm = () => {
        const name = formData.userName.trim();
        if (name) void saveUserName(name);
    };

    const saveSingleField = async () => {
        if (!editModeField) return;
        const name = editModeField.value.trim();
        if (name) await saveUserName(name);
        setEditModeField(null);
    };

    /* ---------- rendu ---------- */
    if (!user) return <Authenticator />; // rendu possible après les hooks

    return (
        <section className="w-full max-w-md mx-auto px-4 py-6 bg-white shadow rounded-lg mb-8">
            <h1 className="text-2xl font-bold text-center mb-6">Mon pseudo public</h1>

            {editModeField && (
                <EditSingleFieldUserName<UserNameData>
                    editModeField={editModeField}
                    setEditModeField={setEditModeField}
                    saveSingleField={saveSingleField}
                    label={userNameLabel}
                />
            )}

            {current === null && !editModeField && (
                <ProfileForm<UserNameData>
                    formData={formData}
                    fields={["userName"]}
                    label={userNameLabel}
                    handleChange={handleChange}
                    handleSubmit={saveProfileForm}
                    isEdit={false}
                    onCancel={() => setFormData({ userName: "" })}
                />
            )}

            {current !== null && !editModeField && (
                <ReadOnlyUserNameView
                    title="Mon pseudo public"
                    fields={["userName"]}
                    profile={{ userName: current }}
                    label={userNameLabel}
                    onEditField={() =>
                        setEditModeField({ field: "userName", value: current ?? "" })
                    }
                />
            )}

            {loading && <p className="text-center">Chargement…</p>}
        </section>
    );
}
