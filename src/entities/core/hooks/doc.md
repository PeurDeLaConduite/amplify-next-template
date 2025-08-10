# Hooks de gestion d'entité

## useEntityManager

Hook utilitaire pour gérer une entité simple composée de champs `string`.

### Paramètres clés

- `fetch` : récupère l'entité actuelle.
- `create` : crée une nouvelle entité.
- `update` : met à jour une entité existante.
- `remove` : supprime l'entité.
- `labels` : retourne un libellé lisible pour chaque champ.
- `fields` : liste des clés gérées.
- `initialData` : valeurs initiales du formulaire.

### Valeurs de retour

- `entity` : entité récupérée ou `null`.
- `formData` et `setFormData` : état local du formulaire.
- `editMode` et `setEditMode` : indicateur d'édition globale.
- `editModeField` et `setEditModeField` : édition ciblée d'un champ.
- `handleChange` : met à jour `formData` depuis un champ `<input>`.
- `save` / `saveField` / `clearField` / `deleteEntity` : actions CRUD.
- `labels`, `fields` : renvoient les paramètres correspondants.
- `loading` : indique qu'une opération est en cours.
- `fetchData` : déclenche manuellement la récupération.

### Exemple basique

```ts
import { useEntityManager } from "@src/entities/core/hooks";

const { formData, handleChange, save } = useEntityManager({
    fetch: async () => null,
    create: async (data) => {},
    update: async (entity, data) => {},
    remove: async (entity) => {},
    labels: (field) => field,
    fields: ["name", "email"],
    initialData: { name: "", email: "" },
});
```

## useEntityManagerGeneral

Variante avancée permettant de typer chaque champ et de définir des règles de validation.

### Paramètres supplémentaires

- `config` : décrit pour chaque champ `parse`, `serialize`, `validate` et `emptyValue`.

### Valeurs de retour

Identiques à `useEntityManager`.

### Exemple avancé

```ts
import { useEntityManagerGeneral } from "@src/entities/core/hooks";

const { formData, handleChange, save } = useEntityManagerGeneral({
    fetch: async () => null,
    create: async (data) => {},
    update: async (entity, data) => {},
    remove: async (entity) => {},
    labels: (field) => field,
    fields: ["age", "active"],
    initialData: { age: 0, active: false },
    config: {
        age: {
            parse: (v) => Number(v),
            serialize: (v) => v,
            validate: (v) => v >= 0,
            emptyValue: 0,
        },
        active: {
            parse: (v) => v === "true",
            serialize: (v) => String(v),
            emptyValue: false,
        },
    },
});
```
