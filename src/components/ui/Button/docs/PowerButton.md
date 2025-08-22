# PowerButton

Bouton de déconnexion de l'utilisateur.

## Usage

```tsx
import { PowerButton } from "@src/components/ui/Button";

<PowerButton onPowerOff={handleLogout} label="Déconnexion" />;
```

## Props

| Nom          | Type                     | Obligatoire | Description                                                     |
| ------------ | ------------------------ | ----------- | --------------------------------------------------------------- |
| `onPowerOff` | `() => void`             | oui         | Callback exécuté au clic.                                       |
| `label`      | `string`                 | non         | Libellé visible (défaut `"Déconnexion"`).                       |
| `title`      | `string`                 | non         | Attribut `title` pour l'accessibilité (défaut `"Déconnexion"`). |
| `className`  | `string`                 | non         | Classe CSS personnalisée.                                       |
| `sx`         | `SxProps<Theme>`         | non         | Styles MUI complémentaires.                                     |
| `size`       | `MuiButtonProps["size"]` | non         | Taille du bouton.                                               |

## Accessibilité

- `variantType="button"` : le libellé est lu par les lecteurs d'écran.
- Icône d'arrêt (`<PowerIcon />`).
