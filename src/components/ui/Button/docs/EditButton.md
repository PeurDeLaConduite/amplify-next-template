# EditButton

Bouton pour **passer en mode édition** d’un objet/champ.

## Import
```ts
import { EditButton } from "@components/ui/Button";
```

## Props
```ts
type EditButtonProps = ButtonWrapperProps & {
  onEdit: () => void;
  editColor?: string; // surcharge couleur (outlined)
};
```

## Usage
```tsx
<EditButton onEdit={() => setEdit(true)} />
<EditButton onEdit={openEditModal} variantType="icon" ariaLabel="Modifier" />
```

## Exemple avec Manager
```tsx
import { EditButton } from "@components/ui/Button";

function Row({ id }: { id: string }) {
  return <EditButton onEdit={() => router.push(`/items/${id}/edit`)} />;
}
```
