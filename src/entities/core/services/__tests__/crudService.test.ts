import { describe, it, expect, vi, beforeEach } from "vitest";
import { crudService } from "@entities/core/services";
import { http, HttpResponse } from "msw";
import { server } from "@test/setup";

vi.mock("@entities/core/services/amplifyClient", () => {
    const baseFetch = (op: string, { authMode, body }: { authMode?: string; body?: unknown }) =>
        fetch(`http://test.local/${op}`, {
            method: "POST",
            headers: { "x-auth-mode": authMode ?? "" },
            body: body ? JSON.stringify(body) : undefined,
        }).then(async (res) => {
            if (!res.ok) throw new Error(res.statusText);
            return res.json();
        });

    const models = {
        Todo: {
            list: (opts?: unknown) => baseFetch("list", opts as any),
            get: (args: unknown, opts?: unknown) =>
                baseFetch("get", { ...(opts as any), body: args }),
            create: (data: unknown, opts?: unknown) =>
                baseFetch("create", { ...(opts as any), body: data }),
            update: (data: unknown, opts?: unknown) =>
                baseFetch("update", { ...(opts as any), body: data }),
            delete: (args: unknown, opts?: unknown) =>
                baseFetch("delete", { ...(opts as any), body: args }),
        },
    };
    return { client: { models }, Schema: { Todo: { type: {} as any } } };
});

vi.mock("@entities/core/auth", () => ({
    canAccess: (_user: unknown, entity: any) => Boolean(entity.allow),
}));

beforeEach(() => {
    server.use(
        http.post("http://test.local/list", ({ request }) => {
            const mode = request.headers.get("x-auth-mode");
            if (mode === "apiKey") return HttpResponse.text("denied", { status: 401 });
            return HttpResponse.json({
                data: [
                    { id: 1, allow: true },
                    { id: 2, allow: false },
                ],
            });
        }),
        http.post("http://test.local/get", ({ request }) => {
            const mode = request.headers.get("x-auth-mode");
            if (mode === "apiKey") return HttpResponse.text("denied", { status: 401 });
            return HttpResponse.json({ data: { id: 1, allow: false } });
        }),
        http.post("http://test.local/create", ({ request }) => {
            const mode = request.headers.get("x-auth-mode");
            if (mode === "apiKey") return HttpResponse.text("denied", { status: 401 });
            return HttpResponse.json({ data: { id: 1 } });
        }),
        http.post("http://test.local/update", ({ request }) => {
            const mode = request.headers.get("x-auth-mode");
            if (mode === "apiKey") return HttpResponse.text("denied", { status: 401 });
            return HttpResponse.json({ data: { id: 1 } });
        }),
        http.post("http://test.local/delete", ({ request }) => {
            const mode = request.headers.get("x-auth-mode");
            if (mode === "apiKey") return HttpResponse.text("denied", { status: 401 });
            return HttpResponse.json({ data: { id: 1 } });
        })
    );
});

describe("crudService", () => {
    const svc = crudService("Todo", {
        auth: { read: ["apiKey", "userPool"], write: ["apiKey", "userPool"] },
    }) as ReturnType<typeof crudService<"Todo">>;

    it("list utilise le fallback et filtre selon canAccess", async () => {
        const fetchSpy = vi.spyOn(global, "fetch");
        const res = await svc.list();
        expect(fetchSpy).toHaveBeenCalledTimes(2);
        expect((fetchSpy.mock.calls[0][1] as any).headers["x-auth-mode"]).toBe("apiKey");
        expect((fetchSpy.mock.calls[1][1] as any).headers["x-auth-mode"]).toBe("userPool");
        expect(res.data).toEqual([{ id: 1, allow: true }]);
        fetchSpy.mockRestore();
    });

    it("get utilise le fallback et renvoie undefined si non accessible", async () => {
        const fetchSpy = vi.spyOn(global, "fetch");
        const res = await svc.get({ id: 1 } as any);
        expect(fetchSpy).toHaveBeenCalledTimes(2);
        expect(res.data).toBeUndefined();
        fetchSpy.mockRestore();
    });

    it("create utilise le fallback", async () => {
        const fetchSpy = vi.spyOn(global, "fetch");
        const res = await svc.create({} as any);
        expect(fetchSpy).toHaveBeenCalledTimes(2);
        expect(res.data).toEqual({ id: 1 });
        fetchSpy.mockRestore();
    });

    it("update utilise le fallback", async () => {
        const fetchSpy = vi.spyOn(global, "fetch");
        const res = await svc.update({} as any);
        expect(fetchSpy).toHaveBeenCalledTimes(2);
        expect(res.data).toEqual({ id: 1 });
        fetchSpy.mockRestore();
    });

    it("delete utilise le fallback", async () => {
        const fetchSpy = vi.spyOn(global, "fetch");
        const res = await svc.delete({ id: 1 } as any);
        expect(fetchSpy).toHaveBeenCalledTimes(2);
        expect(res.data).toEqual({ id: 1 });
        fetchSpy.mockRestore();
    });
});
