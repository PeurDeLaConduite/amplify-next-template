# EditButton

Bouton d'édition d'un élément.

## Usage

```tsx
import { EditButton } from "@src/components/ui/Button";

<EditButton onEdit={handleEdit} label="Modifier" />;
```

## Props

| Nom         | Type                     | Obligatoire | Description                                                  |
| ----------- | ------------------------ | ----------- | ------------------------------------------------------------ |
| `onEdit`    | `() => void`             | oui         | Callback exécuté au clic.                                    |
| `label`     | `string`                 | non         | Libellé visible (défaut `"Modifier"`).                       |
| `title`     | `string`                 | non         | Attribut `title` pour l'accessibilité (défaut `"Modifier"`). |
| `className` | `string`                 | non         | Classe CSS personnalisée.                                    |
| `sx`        | `SxProps<Theme>`         | non         | Styles MUI complémentaires.                                  |
| `size`      | `MuiButtonProps["size"]` | non         | Taille du bouton.                                            |

## Accessibilité

- `variantType="button"` : le libellé rend le bouton accessible, `ariaLabel` n'est pas nécessaire.
- L'icône est décorative et fournie par MUI (`<EditIcon />`).
