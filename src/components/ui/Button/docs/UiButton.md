# UiButton

Composant de base pour tous les boutons. Il se décline en deux variantes via la prop `variantType`.

## Variante `button`

Bouton classique avec un libellé visible.

```tsx
import { UiButton } from "@src/components/ui/Button";
import { Edit } from "@mui/icons-material";

<UiButton
    variantType="button"
    label="Modifier"
    icon={<Edit />}
    buttonProps={{ onClick: handleEdit }}
/>;
```

- Le texte `label` assure l'accessibilité.
- `ariaLabel` est inutile dans cette variante.

## Variante `icon`

Bouton icône sans texte visible. L'accessibilité repose sur `ariaLabel`.

```tsx
import { UiButton } from "@src/components/ui/Button";
import { Delete } from "@mui/icons-material";

<UiButton
    variantType="icon"
    icon={<Delete />}
    ariaLabel="Supprimer"
    iconButtonProps={{ onClick: handleDelete }}
/>;
```

- `ariaLabel` est **obligatoire**.
- Aucun `label` ne doit être fourni.
