export type MinimalUserName = { userName: string };

export type SingleFieldUserName = {
    field: keyof MinimalUserName;
    value: MinimalUserName[keyof MinimalUserName];
};

export const normalizeUserName = (d: Partial<MinimalUserName> = {}): MinimalUserName => ({
    userName: d.userName ?? "",
});

export const userNameLabel = (): string => fieldLabel("userName");
const labels: Record<keyof MinimalUserName, string> = {
    userName: "Pseudo public",
};

export const fieldLabel = (k: keyof MinimalUserName): string => labels[k];
