# RefreshButton

Bouton de rafraîchissement de la page ou des données.

## Usage

```tsx
import { RefreshButton } from "@src/components/ui/Button";

<RefreshButton onRefresh={handleRefresh} label="Rafraîchir la page" />;
```

## Props

| Nom         | Type                     | Obligatoire | Description                                                            |
| ----------- | ------------------------ | ----------- | ---------------------------------------------------------------------- |
| `onRefresh` | `() => void`             | oui         | Callback exécuté au clic.                                              |
| `label`     | `string`                 | non         | Libellé visible (défaut `"Rafraîchir la page"`).                       |
| `title`     | `string`                 | non         | Attribut `title` pour l'accessibilité (défaut `"Rafraîchir la page"`). |
| `className` | `string`                 | non         | Classe CSS personnalisée.                                              |
| `sx`        | `SxProps<Theme>`         | non         | Styles MUI complémentaires.                                            |
| `size`      | `MuiButtonProps["size"]` | non         | Taille du bouton.                                                      |

## Accessibilité

- `variantType="button"` : le libellé est exposé aux technologies d'assistance.
- Icône de rafraîchissement (`<RefreshIcon />`).
