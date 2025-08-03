"use client";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import EditSingleField from "./EditSingleField";
import ReadOnlyProfileView from "./ReadOnlyProfileView";
import ProfileForm from "./ProfileForm";
import { label as fieldLabel, normalizeFormData, MinimalProfile } from "./utilsProfile";
import { DeleteButton } from "@/src/components/buttons/Buttons";
import {
    type UserProfileType,
    createUserProfile,
    updateUserProfile,
    deleteUserProfile,
    observeUserProfile,
} from "@src/entities";

/**
 * Gestion du profil utilisateur (UserProfile uniquement)
 * Logique UserName = composant séparé.
 */
export default function ProfileManager() {
    const { user } = useAuthenticator();
    const [profile, setProfile] = useState<UserProfileType | null>(null);
    const [formData, setFormData] = useState<MinimalProfile>(() => normalizeFormData({}));
    const [editMode, setEditMode] = useState(false);
    const [editModeField, setEditModeField] = useState<{
        field: keyof typeof formData;
        value: string;
    } | null>(null);

    /**
     * 🔄 Abonnement temps‑réel au UserProfile de l’utilisateur
     */
    useEffect(() => {
        if (!user) return;
        const sub = user.userId ?? user.username; // selon Cognito config

        const subscription = observeUserProfile(sub, (item) => {
            setProfile(item);
            if (item && !editMode) {
                const normalized: MinimalProfile = {
                    ...formData,
                    firstName: item.firstName ?? "",
                    familyName: item.familyName ?? "",
                    address: item.address ?? "",
                    postalCode: item.postalCode ?? "",
                    city: item.city ?? "",
                    country: item.country ?? "",
                    phoneNumber: item.phoneNumber ?? "",
                };
                setFormData(normalized);
                Cookies.set("userProfile", JSON.stringify(normalized), {
                    expires: 7,
                    secure: true,
                    sameSite: "Strict",
                });
            }
        });

        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, editMode]);

    // Champ universel
    const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) =>
        setFormData((f) => ({ ...f, [name]: value }));

    // Enregistrer (create/update)
    const saveProfile = async () => {
        try {
            const sub = user?.userId ?? user?.username;
            if (!sub) throw new Error("sub manquant");

            if (profile) {
                await updateUserProfile(sub, formData);
            } else {
                await createUserProfile(sub, formData);
            }
            alert("Profil enregistré ✔");
            setEditMode(false);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la sauvegarde");
        }
    };

    // Mise à jour d'un champ unique
    const saveSingleField = async () => {
        if (!profile || !editModeField) return;
        const { field, value } = editModeField;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await updateUserProfile(profile.id!, { [field]: value } as any);
            setFormData((f) => ({ ...f, [field]: value }));
            setEditModeField(null);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la mise à jour");
        }
    };

    // Efface le contenu d'un champ
    const clearField = async (field: keyof typeof formData) => {
        if (!profile) return;
        if (!confirm(`Supprimer le contenu du champ "${fieldLabel(field)}" ?`)) return;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await updateUserProfile(profile.id!, { [field]: "" } as any);
            setFormData((f) => ({ ...f, [field]: "" }));
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression du champ");
        }
    };

    // Suppression complète
    const handleDeleteProfile = async () => {
        if (!profile) return;
        if (!confirm("Supprimer définitivement votre profil ?")) return;
        try {
            await deleteUserProfile(profile.id!);
            alert("Profil supprimé ✔");
            setFormData(normalizeFormData({}));
            setEditMode(false);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression");
        }
    };

    if (!user) return null;

    return (
        <section className="w-full max-w-md mx-auto px-4 py-6 sm:px-6 sm:py-8 bg-white shadow-sm rounded-lg mb-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Mon profil</h1>

            {/* 👁️ Lecture seule */}
            {!editMode && profile && !editModeField && (
                <ReadOnlyProfileView
                    title="Mon profil"
                    fields={[
                        "firstName",
                        "familyName",
                        "phoneNumber",
                        "address",
                        "postalCode",
                        "city",
                        "country",
                    ]}
                    profile={formData}
                    label={fieldLabel}
                    onEditField={setEditModeField}
                    onClearField={clearField}
                />
            )}

            {/* 📝 Édition d’un champ unique */}
            {editModeField && (
                <EditSingleField
                    editModeField={editModeField}
                    setEditModeField={setEditModeField}
                    saveSingleField={saveSingleField}
                    label={fieldLabel}
                />
            )}

            {/* 🆕 Création ou édition complète */}
            {(editMode || !profile) && !editModeField && (
                <ProfileForm
                    formData={formData}
                    fields={[
                        "firstName",
                        "familyName",
                        "address",
                        "postalCode",
                        "city",
                        "country",
                        "phoneNumber",
                    ]}
                    label={fieldLabel}
                    handleChange={handleChange}
                    handleSubmit={saveProfile}
                    isEdit={!!profile}
                    onCancel={() => {
                        setEditMode(false);
                        setFormData({
                            ...formData,
                            firstName: profile?.firstName ?? "",
                            familyName: profile?.familyName ?? "",
                            address: profile?.address ?? "",
                            postalCode: profile?.postalCode ?? "",
                            city: profile?.city ?? "",
                            country: profile?.country ?? "",
                            phoneNumber: profile?.phoneNumber ?? "",
                        });
                    }}
                />
            )}

            {/* ❌ Supprimer le profil */}
            {profile && !editMode && !editModeField && (
                <div className="flex items-center justify-center mt-8">
                    <DeleteButton onClick={handleDeleteProfile} label={"Supprimer le profil"} />
                </div>
            )}
        </section>
    );
}
