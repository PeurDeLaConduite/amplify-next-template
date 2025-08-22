# ClearFieldButton

Bouton permettant de vider la valeur d'un champ de formulaire.

## Usage

```tsx
import { ClearFieldButton } from "@src/components/ui/Button";

<ClearFieldButton onClear={handleClear} label="Vider le champ" />;
```

## Props

| Nom         | Type                     | Obligatoire | Description                                                        |
| ----------- | ------------------------ | ----------- | ------------------------------------------------------------------ |
| `onClear`   | `() => void`             | oui         | Callback exécuté au clic.                                          |
| `label`     | `string`                 | non         | Libellé visible (défaut `"Vider le champ"`).                       |
| `title`     | `string`                 | non         | Attribut `title` pour l'accessibilité (défaut `"Vider le champ"`). |
| `className` | `string`                 | non         | Classe CSS personnalisée.                                          |
| `sx`        | `SxProps<Theme>`         | non         | Styles MUI complémentaires.                                        |
| `size`      | `MuiButtonProps["size"]` | non         | Taille du bouton.                                                  |

## Accessibilité

- `variantType="button"` : le texte visible rend le bouton accessible.
- Icône de suppression de texte (`<BackspaceIcon />`).
