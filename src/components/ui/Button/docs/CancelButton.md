# CancelButton

Bouton d'annulation d'une action en cours.

## Usage

```tsx
import { CancelButton } from "@src/components/ui/Button";

<CancelButton onCancel={handleCancel} label="Annuler" />;
```

## Props

| Nom         | Type                     | Obligatoire | Description                                                 |
| ----------- | ------------------------ | ----------- | ----------------------------------------------------------- |
| `onCancel`  | `() => void`             | oui         | Callback exécuté au clic.                                   |
| `label`     | `string`                 | non         | Libellé visible (défaut `"Annuler"`).                       |
| `title`     | `string`                 | non         | Attribut `title` pour l'accessibilité (défaut `"Annuler"`). |
| `className` | `string`                 | non         | Classe CSS personnalisée.                                   |
| `sx`        | `SxProps<Theme>`         | non         | Styles MUI complémentaires.                                 |
| `size`      | `MuiButtonProps["size"]` | non         | Taille du bouton.                                           |

## Accessibilité

- `variantType="button"` : le libellé est suffisant pour les lecteurs d'écran.
- L'icône (`<CancelIcon />`) est décorative.
