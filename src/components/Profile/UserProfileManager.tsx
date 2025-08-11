"use client";
import { useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import EntitySection from "./shared/EntitySection";
import { label as fieldLabel } from "./utilsUserProfile";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import { useUserProfileManager } from "@src/entities/models/userProfile/hooks";
import { type UserProfileMinimalType } from "@src/entities/models/userProfile/types";

export default function UserProfileManager() {
    const { user } = useAuthenticator();
    const manager = useUserProfileManager();
    // const baseManager = useUserNameManager();

    const getIcon = (field: keyof UserProfileMinimalType) => {
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

    const renderValue = (field: keyof UserProfileMinimalType, value: string) => {
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
    useEffect(() => {
        if (user) {
            manager.fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (!user) return null;

    return (
        <EntitySection<UserProfileMinimalType>
            title="Mon profil"
            requiredFields={["firstName", "familyName"]}
            renderIcon={getIcon}
            renderValue={renderValue}
            deleteLabel="Supprimer le profil"
            onClearField={(field, clear) => {
                if (confirm(`Supprimer le contenu du champ "${fieldLabel(field)}" ?`)) {
                    void clear(field);
                }
            }}
            manager={manager}
        />
    );
}
