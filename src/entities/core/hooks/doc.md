# Hook de gestion d'entité

## useModelForm

Hook combinant la gestion d'un formulaire d'entité, la synchronisation des relations et l'édition champ par champ.

### Paramètres clés

- `fetch` : récupère l'entité initiale.
- `create` : crée une nouvelle entité.
- `update` : met à jour l'entité courante.
- `remove` : supprime l'entité (optionnel).
- `initialForm` : valeurs initiales du formulaire.
- `initialExtras` : données annexes optionnelles.
- `fields` : liste des champs gérés.
- `config` : pour chaque champ : `parse`, `serialize`, `validate` (optionnel) et `emptyValue`.
- `preSave` / `postSave` : callbacks exécutés avant et après la sauvegarde.
- `syncRelations` : synchronise les relations après sauvegarde.
- `validate` : validation globale optionnelle.
- `mode` : mode initial (`create` ou `edit`).

### Valeurs de retour

- `form`, `setForm` : état du formulaire.
- `extras`, `setExtras` : état additionnel.
- `mode`, `setMode` : mode actuel (`create`/`edit`).
- `dirty` : indique si des changements non sauvegardés existent.
- `saving` : indique si une sauvegarde est en cours.
- `error` : dernière erreur rencontrée.
- `message`, `setMessage` : message utilisateur.
- `editMode`, `setEditMode` : contrôle de l'édition globale.
- `editModeField`, `setEditModeField` : édition champ par champ.
- `handleChange` : met à jour un champ.
- `submit` : sauvegarde globale.
- `saveField` : sauvegarde le champ ciblé.
- `clearField` : réinitialise un champ.
- `fetchData` : rafraîchit l'entité.
- `deleteEntity` : supprime l'entité.
- `startCreate` / `startEdit` / `cancelEdit` : gestion du mode de formulaire.
- `reset` : réinitialise le formulaire.

### Exemple

```ts
import { useModelForm } from "@entities/core/hooks";

const {
    form,
    handleChange,
    submit,
    editMode,
    setEditMode,
    editModeField,
    setEditModeField,
    saveField,
} = useModelForm({
    fetch: async () => null,
    create: async (data) => "id",
    update: async (entity, data) => {},
    remove: async (entity) => {},
    initialForm: { name: "", age: 0 },
    fields: ["name", "age"],
    config: {
        name: {
            parse: (v) => String(v),
            serialize: (v) => v,
            emptyValue: "",
        },
        age: {
            parse: (v) => Number(v),
            serialize: (v) => v,
            validate: (v) => v >= 0,
            emptyValue: 0,
        },
    },
});

handleChange("name", "Jean");
await submit();
```
