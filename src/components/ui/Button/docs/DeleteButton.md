# DeleteButton

Bouton pour **supprimer définitivement** un objet.

## Import
```ts
import { DeleteButton } from "@components/ui/Button";
```

## Props
```ts
type DeleteButtonProps = ButtonWrapperProps & {
  onDelete: () => void;
  editColor?: string; // pour forcer la couleur (sinon intent danger)
};
```

## Usage
```tsx
<DeleteButton onDelete={handleDelete} label="Supprimer" />
<DeleteButton onDelete={handleDelete} variantType="icon" ariaLabel="Supprimer" />
```

## Exemple avec Manager
```tsx
import { DeleteButton } from "@components/ui/Button";
import { useEntityManager } from "@entities/core/manager";

function Row({ id }: { id: string }) {
  const { remove } = useEntityManager<{ id: string }>();

  async function handleDelete() {
    if (!confirm("Supprimer définitivement ?")) return;
    await remove(id);
  }

  return <DeleteButton onDelete={handleDelete} />;
}
```
