# RefreshButton

Bouton pour **rafraîchir les données** et/ou **réinitialiser un formulaire**.

## Import
```ts
import { RefreshButton } from "@components/ui/Button";
```

## Props
```ts
type RefreshButtonProps = ButtonWrapperProps & {
  onRefresh: () => void;
  editColor?: string;
};
```

## Usage
```tsx
<RefreshButton onRefresh={reload} />
```

## Exemple (refresh via manager)
```tsx
import { RefreshButton } from "@components/ui/Button";
import { useEntityManager } from "@entities/core/manager";

function Reload() {
  const { refresh } = useEntityManager<any>();
  return <RefreshButton onRefresh={refresh} variantType="icon" ariaLabel="Rafraîchir" />;
}
```
