# UpdateButton

Bouton pour **enregistrer** une modification (update).

## Import
```ts
import { UpdateButton } from "@components/ui/Button";
```

## Props
```ts
type UpdateButtonProps = ButtonWrapperProps & {
  onUpdate: () => void;
  editColor?: string;
};
```

## Usage
```tsx
<UpdateButton onUpdate={save} label="Sauvegarder" />
```

## Exemple avec Manager
```tsx
import { UpdateButton } from "@components/ui/Button";
import { useEntityManager } from "@entities/core/manager";

function EditForm({ id }: { id: string }) {
  const { update } = useEntityManager<{ name: string }>();
  const [name, setName] = React.useState("");

  async function save() {
    await update(id, { name });
  }

  return <UpdateButton onUpdate={save} label="Sauvegarder" />;
}
```
