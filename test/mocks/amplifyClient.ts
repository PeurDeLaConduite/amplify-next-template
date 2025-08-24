const baseFetch = (url: string, { authMode, body }: { authMode?: string; body?: unknown } = {}) =>
    fetch(url, {
        method: "POST",
        headers: { "x-auth-mode": authMode ?? "" },
        body: body ? JSON.stringify(body) : undefined,
    }).then(async (res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
    });

const models = {
    Todo: {
        list: (opts?: unknown) => baseFetch("http://test.local/list", opts as any),
        get: (args: unknown, opts?: unknown) =>
            baseFetch("http://test.local/get", { ...(opts as any), body: args }),
        create: (data: unknown, opts?: unknown) =>
            baseFetch("http://test.local/create", { ...(opts as any), body: data }),
        update: (data: unknown, opts?: unknown) =>
            baseFetch("http://test.local/update", { ...(opts as any), body: data }),
        delete: (args: unknown, opts?: unknown) =>
            baseFetch("http://test.local/delete", { ...(opts as any), body: args }),
    },
    Comment: {
        get: (args: unknown, opts?: unknown) =>
            baseFetch("http://test.local/get", { ...(opts as any), body: args }),
        create: (data: unknown, opts?: unknown) =>
            baseFetch("http://test.local/create", { ...(opts as any), body: data }),
        update: (data: unknown, opts?: unknown) =>
            baseFetch("http://test.local/update", { ...(opts as any), body: data }),
        delete: (args: unknown, opts?: unknown) =>
            baseFetch("http://test.local/delete", { ...(opts as any), body: args }),
    },
    SectionPost: {
        list: (args?: unknown, opts?: unknown) =>
            fetch("https://api.test/sectionPost/list", {
                method: "POST",
                body: JSON.stringify({ args, opts }),
            }).then((res) => (res.ok ? res.json() : Promise.reject(new Error("list error")))),
        create: (data: unknown, opts?: unknown) =>
            fetch("https://api.test/sectionPost/create", {
                method: "POST",
                body: JSON.stringify({ data, opts }),
            }).then((res) => (res.ok ? res.json() : Promise.reject(new Error("create error")))),
        delete: (where: unknown, opts?: unknown) =>
            fetch("https://api.test/sectionPost/delete", {
                method: "POST",
                body: JSON.stringify({ where, opts }),
            }).then((res) => (res.ok ? res.json() : Promise.reject(new Error("delete error")))),
    },
    PostTag: {
        list: (args?: unknown, opts?: unknown) =>
            fetch("https://api.test/postTag/list", {
                method: "POST",
                body: JSON.stringify({ args, opts }),
            }).then((res) => (res.ok ? res.json() : Promise.reject(new Error("list error")))),
        create: (data: unknown, opts?: unknown) =>
            fetch("https://api.test/postTag/create", {
                method: "POST",
                body: JSON.stringify({ data, opts }),
            }).then((res) => (res.ok ? res.json() : Promise.reject(new Error("create error")))),
        delete: (where: unknown, opts?: unknown) =>
            fetch("https://api.test/postTag/delete", {
                method: "POST",
                body: JSON.stringify({ where, opts }),
            }).then((res) => (res.ok ? res.json() : Promise.reject(new Error("delete error")))),
    },
    TestRelation: {
        list: (args?: unknown) =>
            fetch("https://api.test/relation", {
                method: "POST",
                body: JSON.stringify(args),
            }).then((res) => res.json()),
    },
};

export const client = { models } as const;
export const Schema = {
    Todo: { type: {} as any },
    Comment: { type: {} as any },
    SectionPost: { type: {} as any },
    PostTag: { type: {} as any },
    TestRelation: { type: {} as any },
} as const;

export type Schema = typeof Schema;
