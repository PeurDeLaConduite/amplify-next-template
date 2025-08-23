# PowerButton

Bouton de **déconnexion** (sign out).

## Import
```ts
import { PowerButton } from "@components/ui/Button";
```

## Props
```ts
type PowerButtonProps = ButtonWrapperProps & {
  onPowerOff: () => void;
  editColor?: string; // peut forcer le rouge si votre thème diffère
};
```

## Usage
```tsx
<PowerButton onPowerOff={signOut} label="Déconnexion" />
```

## Exemple (Header)
```tsx
<PowerButton onPowerOff={signOut} variantType="button" />
```
