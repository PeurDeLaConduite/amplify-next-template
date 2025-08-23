# ClearFieldButton

Bouton pour **vider un champ** (reset) et éventuellement **appliquer la maj** via un update côté manager.

## Import
```ts
import { ClearFieldButton } from "@components/ui/Button";
```

## Props
```ts
type ClearFieldButtonProps = ButtonWrapperProps & {
  onClear: () => void;
  editColor?: string;
};
```

## Usage
```tsx
<ClearFieldButton onClear={() => setValue("")} />
```

## Exemple (reset + update)
```tsx
import { ClearFieldButton } from "@components/ui/Button";
import { useEntityManager } from "@entities/core/manager";

function ClearName({ id }: { id: string }) {
  const { update } = useEntityManager<{ name: string }>();
  async function onClear() { await update(id, { name: "" }); }
  return <ClearFieldButton onClear={onClear} variantType="icon" ariaLabel="Vider" />;
}
```
