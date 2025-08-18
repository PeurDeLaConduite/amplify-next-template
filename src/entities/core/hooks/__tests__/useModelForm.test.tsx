import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useModelForm } from "@entities/core/hooks";

interface Form {
    title: string;
    tags: string[];
}

const initialForm: Form = { title: "", tags: [] };

describe("useModelForm", () => {
    it("crée, synchronise et passe en mode edit", async () => {
        const create = vi.fn().mockResolvedValue("1");
        const update = vi.fn();
        const syncRelations = vi.fn().mockResolvedValue(undefined);
        const { result } = renderHook(() =>
            useModelForm<Form>({ initialForm, create, update, syncRelations })
        );

        act(() => {
            result.current.handleChange("title", "hello");
        });
        expect(result.current.dirty).toBe(true);

        await act(async () => {
            await result.current.submit();
        });

        expect(create).toHaveBeenCalledWith({ title: "hello", tags: [] });
        expect(syncRelations).toHaveBeenCalledWith("1", {
            title: "hello",
            tags: [],
        });
        expect(result.current.mode).toBe("edit");
    });

    it("charge les données, met à jour et réinitialise", async () => {
        const load = vi
            .fn()
            .mockResolvedValueOnce({ title: "loaded", tags: [] })
            .mockResolvedValue({ title: "modifié", tags: [] });
        const update = vi.fn().mockResolvedValue("1");
        const create = vi.fn();
        const { result } = renderHook(() =>
            useModelForm<Form>({ initialForm, load, create, update })
        );

        await waitFor(() => {
            expect(result.current.mode).toBe("edit");
            expect(result.current.form.title).toBe("loaded");
        });

        act(() => result.current.handleChange("title", "modifié"));
        expect(result.current.dirty).toBe(true);

        await act(async () => {
            await result.current.submit();
        });
        expect(update).toHaveBeenCalledWith({ title: "modifié", tags: [] });
        expect(result.current.dirty).toBe(false);

        act(() => result.current.handleChange("title", "again"));
        act(() => result.current.reset());
        expect(result.current.form.title).toBe("modifié");
        expect(result.current.dirty).toBe(false);
    });

    it("expose les erreurs et messages", async () => {
        const create = vi.fn().mockRejectedValue(new Error("fail"));
        const update = vi.fn();
        const { result } = renderHook(() => useModelForm<Form>({ initialForm, create, update }));

        await act(async () => {
            await result.current.submit();
        });
        expect(result.current.error).toBeInstanceOf(Error);

        act(() => result.current.setMessage("ok"));
        expect(result.current.message).toBe("ok");
        act(() => result.current.setCreate());
        expect(result.current.message).toBeNull();
    });
});
