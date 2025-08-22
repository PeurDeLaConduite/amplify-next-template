import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useAuthorForm } from "@entities/models/author/hooks";
import { authorService } from "@entities/models/author/service";

vi.mock("@entities/models/author/service", () => ({
    authorService: {
        create: vi.fn(),
        update: vi.fn(),
        list: vi.fn().mockResolvedValue({ data: [] }),
    },
}));

describe("useAuthorForm", () => {
    it("gère la création puis le reset", async () => {
        (authorService.create as any).mockResolvedValue({ data: { id: "a1" } });
        const { result } = renderHook(() => useAuthorForm(null));

        act(() => {
            result.current.handleChange("authorName", "John");
        });

        await act(async () => {
            await result.current.saveForm();
        });

        expect(authorService.create).toHaveBeenCalled();
        expect(result.current.mode).toBe("edit");

        act(() => result.current.handleChange("authorName", "Jane"));
        act(() => result.current.reset());
        expect(result.current.form.authorName).toBe("John");
    });

    it("gère la mise à jour", async () => {
        (authorService.update as any).mockResolvedValue({ data: { id: "a1" } });
        const author = {
            id: "a1",
            authorName: "John",
            avatar: "",
            bio: "",
            email: "",
        } as any;
        const { result } = renderHook(() => useAuthorForm(author));

        await waitFor(() => {
            expect(result.current.mode).toBe("edit");
            expect(result.current.form.authorName).toBe("John");
        });

        act(() => result.current.handleChange("authorName", "Jane"));
        await act(async () => {
            await result.current.saveForm();
        });

        expect(authorService.update).toHaveBeenCalledWith({
            id: "a1",
            authorName: "Jane",
            avatar: "",
            bio: "",
            email: "",
        });
    });
});
