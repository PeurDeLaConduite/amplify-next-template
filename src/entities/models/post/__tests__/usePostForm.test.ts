import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePostForm } from "@entities/models/post/hooks";
import { postService } from "@entities/models/post/service";
import { postTagService } from "@entities/relations/postTag/service";
import { sectionPostService } from "@entities/relations/sectionPost/service";

vi.mock("@entities/models/post/service", () => ({
    postService: {
        create: vi.fn().mockResolvedValue({ data: { id: "post1" } }),
        update: vi.fn().mockResolvedValue({ data: { id: "post1" } }),
    },
}));

vi.mock("@entities/relations/postTag/service", () => ({
    postTagService: {
        listByParent: vi.fn().mockResolvedValue([]),
        create: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
    },
}));

vi.mock("@entities/relations/sectionPost/service", () => ({
    sectionPostService: {
        listByChild: vi.fn().mockResolvedValue([]),
        create: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
    },
}));

vi.mock("@entities/models/author/service", () => ({
    authorService: { list: vi.fn().mockResolvedValue({ data: [] }) },
}));

vi.mock("@entities/models/tag/service", () => ({
    tagService: { list: vi.fn().mockResolvedValue({ data: [] }) },
}));

vi.mock("@entities/models/section/service", () => ({
    sectionService: { list: vi.fn().mockResolvedValue({ data: [] }) },
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("usePostForm", () => {
    it("gère la création, les toggles et le reset", async () => {
        const { result } = renderHook(() => usePostForm(null));

        act(() => {
            result.current.handleChange("title", "Titre");
            result.current.syncM2MTag("tag1");
            result.current.toggleSection("section1");
        });

        await act(async () => {
            await result.current.submit();
        });

        expect(postService.create).toHaveBeenCalled();
        expect(result.current.form.tagIds).toEqual(["tag1"]);
        expect(result.current.form.sectionIds).toEqual(["section1"]);
        expect(result.current.mode).toBe("edit");

        act(() => {
            result.current.handleChange("title", "Nouveau");
            result.current.reset();
        });
        expect(result.current.form.title).toBe("Titre");
        expect(result.current.form.tagIds).toEqual(["tag1"]);
    });

    it("synchronise les tags et sections", async () => {
        (postTagService.listByParent as any).mockResolvedValue(["tag1"]);
        (sectionPostService.listByChild as any).mockResolvedValue(["section1"]);
        const post = { id: "post1", seo: {} } as any;
        const { result } = renderHook(() => usePostForm(post));

        await waitFor(() => {
            expect(result.current.form.tagIds).toEqual(["tag1"]);
            expect(result.current.form.sectionIds).toEqual(["section1"]);
        });

        act(() => {
            result.current.syncM2MTag("tag1");
            result.current.syncM2MTag("tag2");
            result.current.toggleSection("section1");
            result.current.toggleSection("section2");
        });

        await act(async () => {
            await result.current.submit();
        });

        expect(postTagService.create).toHaveBeenCalledWith("post1", "tag2");
        expect(postTagService.delete).toHaveBeenCalledWith("post1", "tag1");
        expect(sectionPostService.create).toHaveBeenCalledWith("section2", "post1");
        expect(sectionPostService.delete).toHaveBeenCalledWith("section1", "post1");
    });
});
