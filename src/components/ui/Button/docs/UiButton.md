# UiButton

Composant de base utilisé par tous les wrappers (Edit/Delete/etc.).  
Il normalise l’API MUI en ajoutant `variantType` et des conventions d’accessibilité.

## Import
```ts
import { UiButton } from "@components/ui/Button";
```

## Props
```ts
type VariantType = "button" | "icon";

export type UiButtonProps = {
  variantType: VariantType;
  label?: string;                 // requis si variantType="button"
  ariaLabel?: string;             // requis si variantType="icon" (fallback = label)
  icon?: React.ReactNode;
  href?: string;                  // si fourni, rend un <a> / Link
  intent?: "primary" | "neutral" | "success" | "danger" | "warning" | "ghost";
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  sx?: SxProps<Theme>;
  buttonProps?: ButtonProps;      // transmis à MUI Button
  iconButtonProps?: IconButtonProps; // transmis à MUI IconButton
  title?: string;
};
```

## Bonnes pratiques
- En mode **icon**, fournissez **`ariaLabel`** (ou un `label` qui servira de fallback).
- Passez un **`title`** si vous voulez un tooltip natif.
