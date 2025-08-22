# UpdateButton

Bouton pour enregistrer les modifications d'un élément existant.

## Usage

```tsx
import { UpdateButton } from "@src/components/ui/Button";

<UpdateButton onUpdate={handleUpdate} label="Enregistrer" />;
```

## Props

| Nom         | Type                     | Obligatoire | Description                                                     |
| ----------- | ------------------------ | ----------- | --------------------------------------------------------------- |
| `onUpdate`  | `() => void`             | oui         | Callback exécuté au clic.                                       |
| `label`     | `string`                 | non         | Libellé visible (défaut `"Enregistrer"`).                       |
| `title`     | `string`                 | non         | Attribut `title` pour l'accessibilité (défaut `"Enregistrer"`). |
| `className` | `string`                 | non         | Classe CSS personnalisée.                                       |
| `sx`        | `SxProps<Theme>`         | non         | Styles MUI complémentaires.                                     |
| `size`      | `MuiButtonProps["size"]` | non         | Taille du bouton.                                               |

## Accessibilité

- `variantType="button"` : le `label` suffit pour l'accessibilité.
- Icône de sauvegarde (`<SaveIcon />`).
