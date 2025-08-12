# Hooks de gestion d'entité

## useEntityManager

Hook utilitaire pour gérer une entité. Il prend en charge des champs `string`, des tableaux (IDs de relations) ou encore des objets imbriqués via une configuration.

### Paramètres clés

- `fetch` : récupère l'entité actuelle.
- `create` : crée une nouvelle entité.
- `update` : met à jour une entité existante.
- `remove` : supprime l'entité.
- `labels` : retourne un libellé lisible pour chaque champ.
- `fields` : liste des clés gérées.
- `initialData` : valeurs initiales du formulaire.
- `config` : décrit pour chaque champ `parse`, `serialize`, `validate` (optionnel) et `emptyValue`.
- `preSave` : callback optionnel exécuté avant la sauvegarde (ex. synchronisation de relations). Il peut retourner les données à persister.
- `postSave` : callback optionnel exécuté après la sauvegarde.

### Valeurs de retour

- `entity` : entité récupérée ou `null`.
- `formData` et `setFormData` : état local du formulaire.
- `editMode` et `setEditMode` : indicateur d'édition globale.
- `editModeField` et `setEditModeField` : édition ciblée d'un champ.
- `handleChange` : met à jour `formData` pour un champ donné.
- `save` / `saveField` / `clearField` / `deleteEntity` : actions CRUD.
- `labels`, `fields` : renvoient les paramètres correspondants.
- `loading` : indique qu'une opération est en cours.
- `fetchData` : déclenche manuellement la récupération et retourne l'entité.

### Exemple

```ts
import { useEntityManager } from "@entities/core/hooks";

const { formData, handleChange, save } = useEntityManager({
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

// Exemple d'utilisation de handleChange
handleChange("age", "42");
```
