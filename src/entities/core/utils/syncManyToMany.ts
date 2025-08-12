export async function syncManyToMany(
    currentIds: string[],
    targetIds: string[],
    createFn: (id: string) => Promise<unknown>,
    deleteFn: (id: string) => Promise<unknown>
) {
    const toAdd = targetIds.filter((id) => !currentIds.includes(id));
    const toRemove = currentIds.filter((id) => !targetIds.includes(id));
    await Promise.all([...toAdd.map((id) => createFn(id)), ...toRemove.map((id) => deleteFn(id))]);
}
