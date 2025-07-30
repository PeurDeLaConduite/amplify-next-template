export default function ItemSelector<
    T extends Record<K, string> & { order?: number },
    K extends keyof T,
>({ items, idKey, selectedIds, onChange, label, getLabel }: ItemSelectorProps<T, K>) {
    const toggle = (id: T[K]) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((x) => x !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    // On trie par order si présent, sinon on garde l'ordre initial
    const sortedItems = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return (
        <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-3">{label}</label>
            <div className="border rounded-md max-h-60 overflow-auto p-2 bg-gray-50">
                {sortedItems.map((item, idx) => {
                    const id = item[idKey];
                    const checked = selectedIds.includes(id);
                    return (
                        <div
                            key={id || `item-${idx}`}
                            className={`flex items-center p-2 mb-1 rounded-md cursor-pointer ${
                                checked
                                    ? "bg-green-100 border border-green-400"
                                    : "bg-white hover:bg-gray-100"
                            }`}
                            onClick={() => toggle(id)}
                        >
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggle(id)}
                                className="mr-2 cursor-pointer"
                            />
                            <div>
                                <span className="font-medium">{getLabel(item)}</span>{" "}
                                <span className="text-sm text-gray-500">(ID: {id})</span>
                                {"order" in item && typeof item.order === "number" ? (
                                    <span className="ml-2 text-xs text-gray-400">
                                        ordre : {item.order}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
