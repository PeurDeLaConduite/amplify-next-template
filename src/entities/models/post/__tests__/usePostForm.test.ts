import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { usePostForm } from "@entities/models/post/hooks";
import { postTagService } from "@entities/relations/postTag/service";
import { sectionPostService } from "@entities/relations/sectionPost/service";

vi.mock("@entities/models/post/service", () => ({
    postService: {
        create: vi.fn(),
        update: vi.fn().mockResolvedValue({ data: { id: "post1" } }),
    },
}));

vi.mock("@entities/relations/postTag/service", () => ({
    postTagService: {
        listByParent: vi.fn().mockResolvedValue(["tag1"]),
        create: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
    },
}));

vi.mock("@entities/relations/sectionPost/service", () => ({
    sectionPostService: {
        listByChild: vi.fn().mockResolvedValue(["section1"]),
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

describe("usePostForm syncRelations", () => {
    it("synchronise les tags et sections", async () => {
        const post = { id: "post1", seo: {} } as any;
        const { result } = renderHook(() => usePostForm(post));

        await waitFor(() => {
            expect(result.current.form.tagIds).toEqual(["tag1"]);
            expect(result.current.form.sectionIds).toEqual(["section1"]);
        });

        act(() => {
            result.current.toggleTag("tag1");
            result.current.toggleTag("tag2");
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
