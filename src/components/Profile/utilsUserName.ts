export type MinimalUserName = { userName: string; id?: string };
export type SingleFieldUserName = {
    field: "userName";
    value: string;
};
export const normalizeUserName = (d: Partial<MinimalUserName> = {}): MinimalUserName => ({
    userName: d.userName ?? "",
});
export const fieldLabel = (k: string) =>
    ({
        userName: "Pseudo public",
    })[k] ?? k;
export const userNameLabel = (): string => fieldLabel("userName");
