# CancelButton

Bouton pour **sortir du mode édition** sans sauvegarder ou **restaurer** l’état initial (selon votre logique).

## Import
```ts
import { CancelButton } from "@components/ui/Button";
```

## Props
```ts
type CancelButtonProps = ButtonWrapperProps & {
  onCancel: () => void;
  editColor?: string;
};
```

## Usage
```tsx
<CancelButton onCancel={() => setEdit(false)} />
```

## Exemple (reset d’un formulaire local)
```tsx
<CancelButton onCancel={() => setForm(initial)} />
```
