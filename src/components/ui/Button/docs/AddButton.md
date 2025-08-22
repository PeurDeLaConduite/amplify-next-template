# AddButton

Bouton d'ajout d'un nouvel élément.

## Usage

```tsx
import { AddButton } from "@src/components/ui/Button";

<AddButton onAdd={handleAdd} label="Ajouter" />;
```

## Props

| Nom         | Type                     | Obligatoire | Description                                                 |
| ----------- | ------------------------ | ----------- | ----------------------------------------------------------- |
| `onAdd`     | `() => void`             | oui         | Callback exécuté au clic.                                   |
| `label`     | `string`                 | non         | Libellé visible (défaut `"Ajouter"`).                       |
| `title`     | `string`                 | non         | Attribut `title` pour l'accessibilité (défaut `"Ajouter"`). |
| `className` | `string`                 | non         | Classe CSS personnalisée.                                   |
| `sx`        | `SxProps<Theme>`         | non         | Styles MUI complémentaires.                                 |
| `size`      | `MuiButtonProps["size"]` | non         | Taille du bouton.                                           |

## Accessibilité

- `variantType="button"` : le `label` rend le bouton accessible.
- L'icône d'ajout (`<AddIcon />`) est purement visuelle.
