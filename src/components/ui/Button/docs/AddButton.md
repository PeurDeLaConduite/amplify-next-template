# AddButton

Bouton pour **démarrer une création** ou **ouvrir un mode édition vide**.

## Import
```ts
import { AddButton } from "@components/ui/Button";
```

## Props
```ts
type AddButtonProps = ButtonWrapperProps & {
  onAdd: () => void;
  editColor?: string;
};
```

## Usage
```tsx
<AddButton onAdd={() => setOpen(true)} label="Ajouter" />
```

## Exemple avec Manager (création rapide)
```tsx
import { AddButton } from "@components/ui/Button";
import { useEntityManager } from "@entities/core/manager";

function QuickCreate() {
  const { create } = useEntityManager<{ name: string }>();
  return (
    <AddButton onAdd={() => create({ name: "Nouveau" })} variantType="icon" ariaLabel="Ajouter" />
  );
}
```
