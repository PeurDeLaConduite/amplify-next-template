export interface ListRequest<TFilter> {
    args?: { filter?: TFilter };
    opts?: { authMode?: string };
}

export interface CreateRequest<TData> {
    data: TData;
    opts?: { authMode?: string };
}

export interface DeleteRequest<TWhere> {
    where: TWhere;
    opts?: { authMode?: string };
}
