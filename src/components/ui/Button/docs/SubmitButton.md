# SubmitButton

Bouton de soumission pour créer un élément.

## Usage

```tsx
import { SubmitButton } from "@src/components/ui/Button";

<SubmitButton onSubmit={handleSubmit} label="Créer" />;
```

## Props

| Nom         | Type                     | Obligatoire | Description                                               |
| ----------- | ------------------------ | ----------- | --------------------------------------------------------- |
| `onSubmit`  | `() => void`             | oui         | Callback exécuté au clic.                                 |
| `label`     | `string`                 | non         | Libellé visible (défaut `"Créer"`).                       |
| `title`     | `string`                 | non         | Attribut `title` pour l'accessibilité (défaut `"Créer"`). |
| `className` | `string`                 | non         | Classe CSS personnalisée.                                 |
| `sx`        | `SxProps<Theme>`         | non         | Styles MUI complémentaires.                               |
| `size`      | `MuiButtonProps["size"]` | non         | Taille du bouton.                                         |

## Accessibilité

- `variantType="button"` : le libellé suffit pour l'a11y.
- Icône de sauvegarde (`<SaveIcon />`).
