# BackButton

Bouton pour **revenir en arrière** : soit fermeture d’un mode édition inline, soit navigation (page précédente).

## Import
```ts
import { BackButton } from "@components/ui/Button";
```

## Props
```ts
type BackButtonProps = ButtonWrapperProps &
  ({ href: string; onBack?: never } | { onBack: () => void; href?: never }) & {
    editColor?: string;
  };
```

## Usage
```tsx
<BackButton onBack={() => setEditModeField(null)} label="Retour" />
<BackButton href="/dashboard" label="Retour" />
```

## Exemple (inline edit)
```tsx
<BackButton onBack={() => setEdit(false)} variantType="icon" ariaLabel="Retour" />
```
