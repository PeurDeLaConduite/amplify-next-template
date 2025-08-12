import RequireAdmin from "../../../RequireAdmin";
import AuthorsForm from "./AuthorsForm";

export default function CreateAuthor() {
    return (
        <RequireAdmin>
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Éditeur de blog : Auteurs</h1>
                <AuthorsForm />
            </div>
        </RequireAdmin>
    );
}
