# SubmitButton

Bouton pour **créer** un nouvel objet.

## Import
```ts
import { SubmitButton } from "@components/ui/Button";
```

## Props
```ts
type SubmitButtonProps = ButtonWrapperProps & {
  onSubmit: () => void;
  editColor?: string;
};
```

## Usage
```tsx
<SubmitButton onSubmit={createItem} label="Créer" />
```
