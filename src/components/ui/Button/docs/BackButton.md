# BackButton

Bouton de retour en arrière ou de navigation.

## Usage

### Navigation

```tsx
import { BackButton } from "@src/components/ui/Button";

<BackButton href="/" label="Retour" />;
```

### Action

```tsx
<BackButton onBack={handleBack} label="Retour" />
```

## Props

| Nom         | Type                     | Obligatoire | Description                                                          |
| ----------- | ------------------------ | ----------- | -------------------------------------------------------------------- |
| `href`      | `string`                 | non\*       | Navigue vers l'URL indiquée (\*mutuellement exclusif avec `onBack`). |
| `onBack`    | `() => void`             | non\*       | Callback exécuté au clic (\*mutuellement exclusif avec `href`).      |
| `label`     | `string`                 | non         | Libellé visible (défaut `"Retour"`).                                 |
| `title`     | `string`                 | non         | Attribut `title` pour l'accessibilité (défaut `"Retour"`).           |
| `className` | `string`                 | non         | Classe CSS personnalisée.                                            |
| `sx`        | `SxProps<Theme>`         | non         | Styles MUI complémentaires.                                          |
| `size`      | `MuiButtonProps["size"]` | non         | Taille du bouton.                                                    |

## Accessibilité

- `variantType="button"` : le `label` suffit pour l'a11y.
- Icône de retour (`<ArrowBackIcon />`).
