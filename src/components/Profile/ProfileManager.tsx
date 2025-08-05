"use client";
import Cookies from "js-cookie";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import useEntityManager from "./useEntityManager";
import EditField from "./EditField";
import ReadOnlyView from "./ReadOnlyView";
import ProfileForm from "./ProfileForm";
import { label as fieldLabel, normalizeFormData, MinimalProfile } from "./utilsProfile";
import { DeleteButton } from "@/src/components/buttons/Buttons";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import {
    createUserProfile,
    updateUserProfile,
    deleteUserProfile,
    observeUserProfile,
} from "@/src/services";

/**
 * Gestion du profil utilisateur (UserProfile uniquement)
 * Logique UserName = composant séparé.
 */
export default function ProfileManager() {
    const { user } = useAuthenticator();
    const sub = user?.userId ?? user?.username;

    const {
        entity,
        formData,
        setFormData,
        editMode,
        setEditMode,
        editModeField,
        setEditModeField,
        handleChange,
        save,
        saveField,
        clearField,
        deleteEntity,
        labels,
        fields,
    } = useEntityManager<MinimalProfile>({
        fields: [
            "firstName",
            "familyName",
            "phoneNumber",
            "address",
            "postalCode",
            "city",
            "country",
        ],
        labels: fieldLabel,
        initialData: normalizeFormData({}),
        fetch: (setData) => {
            if (!sub) return;
            const subscription = observeUserProfile(sub, (item) => {
                if (item) {
                    const data: MinimalProfile & { id?: string } = {
                        id: item.id,
                        firstName: item.firstName ?? "",
                        familyName: item.familyName ?? "",
                        address: item.address ?? "",
                        postalCode: item.postalCode ?? "",
                        city: item.city ?? "",
                        country: item.country ?? "",
                        phoneNumber: item.phoneNumber ?? "",
                    };
                    setData(data);
                    Cookies.set("userProfile", JSON.stringify(data), {
                        expires: 7,
                        secure: true,
                        sameSite: "Strict",
                    });
                } else {
                    setData(null);
                }
            });
            return () => subscription.unsubscribe();
        },
        create: async (data) => {
            if (!sub) throw new Error("sub manquant");
            await createUserProfile(sub, data);
        },
        update: async (entity, data) => {
            if (!entity?.id) throw new Error("id manquant");
            await updateUserProfile(entity.id, data);
        },
        remove: async (entity) => {
            if (!entity?.id) return;
            await deleteUserProfile(entity.id);
        },
    });
    const getIcon = (field: keyof MinimalProfile) => {
        switch (field) {
            case "phoneNumber":
                return <PhoneIcon fontSize="small" className="text-gray-800" />;
            case "firstName":
            case "familyName":
                return <PersonIcon fontSize="small" className="text-gray-800" />;
            case "address":
            case "postalCode":
            case "city":
            case "country":
                return <HomeIcon fontSize="small" className="text-gray-800" />;
            default:
                return null;
        }
    };

    function formatPhoneNumber(number?: string): string {
        if (!number) return "";
        return number.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
    }

    const renderValue = (field: keyof MinimalProfile, value: string) => {
        if (field === "phoneNumber") {
            return value ? (
                <a href={`tel:${value}`} className="text-base text-gray-900 hover:underline">
                    {formatPhoneNumber(value)}
                </a>
            ) : (
                <p className="text-sm text-gray-400 italic">Numéro non renseigné</p>
            );
        }
        return value ? (
            <p className="text-base text-gray-900 break-words">{value}</p>
        ) : (
            <p className="text-sm text-gray-400 italic">Information non disponible</p>
        );
    };
    if (!user) return null;

    return (
        <section className="w-full max-w-md mx-auto px-4 py-6 sm:px-6 sm:py-8 bg-white shadow-sm rounded-lg mb-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Mon profil</h1>

            {!editMode && entity && !editModeField && (
                <ReadOnlyView<MinimalProfile>
                    title="Mon profil"
                    fields={fields}
                    data={formData}
                    label={labels}
                    renderIcon={getIcon}
                    renderValue={renderValue}
                    onEditField={setEditModeField}
                    onClearField={(field) => {
                        if (confirm(`Supprimer le contenu du champ "${labels(field)}" ?`)) {
                            void clearField(field);
                        }
                    }}
                />
            )}

            {editModeField && (
                <EditField<MinimalProfile>
                    editModeField={editModeField}
                    setEditModeField={setEditModeField}
                    saveSingleField={saveField}
                    label={labels}
                />
            )}

            {(editMode || !entity) && !editModeField && (
                <ProfileForm
                    formData={formData}
                    fields={fields}
                    label={labels}
                    handleChange={handleChange}
                    handleSubmit={save}
                    isEdit={!!entity}
                    onCancel={() => {
                        setEditMode(false);
                        if (entity) {
                            const reset = { ...formData };
                            fields.forEach((f) => {
                                reset[f] = entity[f] ?? "";
                            });
                            setFormData(reset);
                        }
                    }}
                />
            )}

            {entity && !editMode && !editModeField && (
                <div className="flex items-center justify-center mt-8">
                    <DeleteButton onClick={deleteEntity} label={"Supprimer le profil"} />
                </div>
            )}
        </section>
    );
}
