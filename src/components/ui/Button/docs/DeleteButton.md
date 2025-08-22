# DeleteButton

Bouton de suppression d'un élément.

## Usage

```tsx
import { DeleteButton } from "@src/components/ui/Button";

<DeleteButton onDelete={handleDelete} label="Supprimer" />;
```

## Props

| Nom         | Type                     | Obligatoire | Description                                                   |
| ----------- | ------------------------ | ----------- | ------------------------------------------------------------- |
| `onDelete`  | `() => void`             | oui         | Callback exécuté au clic.                                     |
| `label`     | `string`                 | non         | Libellé visible (défaut `"Supprimer"`).                       |
| `title`     | `string`                 | non         | Attribut `title` pour l'accessibilité (défaut `"Supprimer"`). |
| `className` | `string`                 | non         | Classe CSS personnalisée.                                     |
| `sx`        | `SxProps<Theme>`         | non         | Styles MUI complémentaires.                                   |
| `size`      | `MuiButtonProps["size"]` | non         | Taille du bouton.                                             |

## Accessibilité

- `variantType="button"` : le libellé rend le bouton accessible, aucun `ariaLabel` requis.
- Icône de suppression fournie par MUI (`<DeleteIcon />`).
