import { SaveButton, AddButton, CancelButton } from "../buttons/Buttons"

type Props = {
    formData: {
        firstName: string;
        familyName: string;
        address: string;
        postalCode: string;
        city: string;
        country: string;
        phoneNumber: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: () => void;
    isEdit: boolean;
    onCancel: () => void;
};

export default function ProfileForm({
    formData,
    handleChange,
    handleSubmit,
    isEdit,
    onCancel,
}: Props) {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            className="space-y-5 p-6 bg-white border rounded-md shadow-sm max-w-md mx-auto"
        >
            {/* Prénom */}
            <div>
                <label htmlFor="firstName" className="block mb-1 font-medium">
                    Prénom
                </label>
                <input
                    id="firstName"
                    name="firstName"
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            {/* Nom */}
            <div>
                <label htmlFor="familyName" className="block mb-1 font-medium">
                    Nom
                </label>
                <input
                    id="familyName"
                    name="familyName"
                    placeholder="Nom"
                    value={formData.familyName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            {/* Adresse */}
            <div>
                <label htmlFor="address" className="block mb-1 font-medium">
                    Adresse
                </label>
                <input
                    id="address"
                    name="address"
                    placeholder="Adresse"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>

            {/* Code postal */}
            <div>
                <label htmlFor="postalCode" className="block mb-1 font-medium">
                    Code postal
                </label>
                <input
                    id="postalCode"
                    name="postalCode"
                    placeholder="75001"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>

            {/* Ville */}
            <div>
                <label htmlFor="city" className="block mb-1 font-medium">
                    Ville
                </label>
                <input
                    id="city"
                    name="city"
                    placeholder="Paris"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>

            {/* Pays */}
            <div>
                <label htmlFor="country" className="block mb-1 font-medium">
                    Pays
                </label>
                <input
                    id="country"
                    name="country"
                    placeholder="France"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>

            {/* Téléphone */}
            <div>
                <label htmlFor="phoneNumber" className="block mb-1 font-medium">
                    Téléphone
                </label>
                <input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Téléphone"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>

            {/* Boutons */}
            <div className="flex justify-end gap-2 pt-2">
                {isEdit ? (
                    <>
                        <SaveButton
                            onClick={handleSubmit}
                            label="Enregistrer"
                            className="min-w-[120px]"
                        />
                        <CancelButton
                            onClick={onCancel}
                            label="Annuler"
                            className="min-w-[120px]"
                        />
                    </>
                ) : (
                    <AddButton onClick={handleSubmit} label="Créer" className="min-w-[120px]" />
                )}
            </div>
        </form>
    );
}
