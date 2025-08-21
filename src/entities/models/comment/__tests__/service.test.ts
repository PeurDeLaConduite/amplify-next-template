import { describe, it, expect, vi, beforeEach } from "vitest";
import { commentService } from "@entities/models/comment";
import { http, HttpResponse } from "msw";
import { server } from "@test/setup";
import type { CommentCreateInput, CommentUpdateInput } from "@src/types/models/comment";

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
        Comment: {
            get: (args: { id: string }, opts?: { authMode?: string }) =>
                baseFetch("get", { ...opts, body: args }),
            create: (data: CommentCreateInput, opts?: { authMode?: string }) =>
                baseFetch("create", { ...opts, body: data }),
            update: (data: CommentUpdateInput & { id: string }, opts?: { authMode?: string }) =>
                baseFetch("update", { ...opts, body: data }),
            delete: (args: { id: string }, opts?: { authMode?: string }) =>
                baseFetch("delete", { ...opts, body: args }),
        },
    };

    return { client: { models }, Schema: { Comment: { type: {} as Record<string, never> } } };
});

vi.mock("@entities/core/auth", () => ({ canAccess: () => true }));

beforeEach(() => {
    server.use(
        http.post("http://test.local/get", ({ request }) => {
            const mode = request.headers.get("x-auth-mode");
            if (mode === "apiKey") return HttpResponse.text("denied", { status: 401 });
            return HttpResponse.json({ data: { id: 1 } });
        }),
        http.post("http://test.local/create", ({ request }) => {
            const mode = request.headers.get("x-auth-mode");
            if (mode !== "userPool") return HttpResponse.text("denied", { status: 401 });
            return HttpResponse.json({ data: { id: 1 } });
        }),
        http.post("http://test.local/update", ({ request }) => {
            const mode = request.headers.get("x-auth-mode");
            if (mode !== "userPool") return HttpResponse.text("denied", { status: 401 });
            return HttpResponse.json({ data: { id: 1 } });
        }),
        http.post("http://test.local/delete", ({ request }) => {
            const mode = request.headers.get("x-auth-mode");
            if (mode !== "userPool") return HttpResponse.text("denied", { status: 401 });
            return HttpResponse.json({ data: { id: 1 } });
        })
    );
});

describe("commentService", () => {
    it("get utilise le fallback d'authentification", async () => {
        const fetchSpy = vi.spyOn(global, "fetch");
        const res = await commentService.get({ id: "1" });
        expect(fetchSpy).toHaveBeenCalledTimes(2);
        const headers0 = (fetchSpy.mock.calls[0][1]?.headers as Record<string, string>)[
            "x-auth-mode"
        ];
        const headers1 = (fetchSpy.mock.calls[1][1]?.headers as Record<string, string>)[
            "x-auth-mode"
        ];
        expect(headers0).toBe("apiKey");
        expect(headers1).toBe("userPool");
        expect(res.data).toEqual({ id: 1 });
        fetchSpy.mockRestore();
    });

    it("create accepte les ID null et utilise userPool", async () => {
        const fetchSpy = vi.spyOn(global, "fetch");
        const res = await commentService.create({
            content: "",
            todoId: null,
            postId: null,
            userNameId: null,
        });
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        const headers = (fetchSpy.mock.calls[0][1]?.headers as Record<string, string>)[
            "x-auth-mode"
        ];
        expect(headers).toBe("userPool");
        expect(res.data).toEqual({ id: 1 });
        fetchSpy.mockRestore();
    });

    it("update utilise userPool", async () => {
        const fetchSpy = vi.spyOn(global, "fetch");
        const res = await commentService.update({ id: "1", content: "" });
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        const headers = (fetchSpy.mock.calls[0][1]?.headers as Record<string, string>)[
            "x-auth-mode"
        ];
        expect(headers).toBe("userPool");
        expect(res.data).toEqual({ id: 1 });
        fetchSpy.mockRestore();
    });

    it("delete utilise userPool", async () => {
        const fetchSpy = vi.spyOn(global, "fetch");
        const res = await commentService.delete({ id: "1" });
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        const headers = (fetchSpy.mock.calls[0][1]?.headers as Record<string, string>)[
            "x-auth-mode"
        ];
        expect(headers).toBe("userPool");
        expect(res.data).toEqual({ id: 1 });
        fetchSpy.mockRestore();
    });
});
