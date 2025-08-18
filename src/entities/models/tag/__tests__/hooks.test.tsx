import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { TagType } from "@entities/models/tag/types";
import type { PostType } from "@entities/models/post/types";

vi.mock("@entities/models/tag/service", () => ({
    tagService: {
        list: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}));

vi.mock("@entities/models/post/service", () => ({
    postService: {
        list: vi.fn(),
    },
}));

vi.mock("@entities/relations/postTag/service", () => ({
    postTagService: {
        list: vi.fn(),
        listByChild: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
    },
}));

import { tagService } from "@entities/models/tag/service";
import { postService } from "@entities/models/post/service";
import { postTagService } from "@entities/relations/postTag/service";
import { useTagForm } from "@entities/models/tag/hooks";

const tags: TagType[] = [
    { id: "t1", name: "Tag1" } as TagType,
    { id: "t2", name: "Tag2" } as TagType,
];
const posts: PostType[] = [{ id: "p1", title: "Post1" } as PostType];
const postTags = [{ postId: "p1", tagId: "t1" }];

beforeEach(() => {
    vi.resetAllMocks();
    (tagService.list as ReturnType<typeof vi.fn>).mockResolvedValue({ data: tags });
    (postService.list as ReturnType<typeof vi.fn>).mockResolvedValue({ data: posts });
    (postTagService.list as ReturnType<typeof vi.fn>).mockResolvedValue({ data: postTags });
    (postTagService.listByChild as ReturnType<typeof vi.fn>).mockImplementation(
        async (tagId: string) => (tagId === "t1" ? ["p1"] : [])
    );
});

describe("useTagForm", () => {
    it("fetchAll charge tags, posts et liaisons", async () => {
        const { result } = renderHook(() => useTagForm());
        await act(async () => {
            await result.current.fetchAll();
        });
        expect(result.current.extras.tags).toEqual(tags);
        expect(result.current.extras.posts).toEqual(posts);
        expect(result.current.extras.postTags).toEqual(postTags);
    });

    it("toggle ajoute puis retire une liaison", async () => {
        const createMock = postTagService.create as ReturnType<typeof vi.fn>;
        const deleteMock = postTagService.delete as ReturnType<typeof vi.fn>;
        createMock.mockResolvedValue({});
        deleteMock.mockResolvedValue({});
        const { result } = renderHook(() => useTagForm());
        await act(async () => {
            await result.current.fetchAll();
        });
        await act(async () => {
            await result.current.toggle("p1", "t2");
        });
        expect(createMock).toHaveBeenCalledWith("p1", "t2");
        expect(result.current.extras.postTags).toContainEqual({ postId: "p1", tagId: "t2" });
        await act(async () => {
            await result.current.toggle("p1", "t2");
        });
        expect(deleteMock).toHaveBeenCalledWith("p1", "t2");
        expect(result.current.extras.postTags).not.toContainEqual({ postId: "p1", tagId: "t2" });
    });

    it("edit préremplit le formulaire et fixe l'index", async () => {
        const { result } = renderHook(() => useTagForm());
        await act(async () => {
            await result.current.fetchAll();
        });
        await act(async () => {
            await result.current.edit(0);
        });
        expect(result.current.form).toEqual({ name: "Tag1", postIds: ["p1"] });
        expect(result.current.extras.index).toBe(0);
    });

    it("cancel réinitialise le formulaire et l'index", async () => {
        const { result } = renderHook(() => useTagForm());
        await act(async () => {
            await result.current.fetchAll();
        });
        await act(async () => {
            await result.current.edit(0);
        });
        act(() => {
            result.current.cancel();
        });
        expect(result.current.form).toEqual({ name: "", postIds: [] });
        expect(result.current.extras.index).toBeNull();
    });

    it("remove supprime le tag et réinitialise l'index", async () => {
        const deleteTagMock = tagService.delete as ReturnType<typeof vi.fn>;
        const deleteRelationMock = postTagService.delete as ReturnType<typeof vi.fn>;
        deleteTagMock.mockResolvedValue({});
        deleteRelationMock.mockResolvedValue({});
        vi.spyOn(window, "confirm").mockReturnValue(true);
        const { result } = renderHook(() => useTagForm());
        await act(async () => {
            await result.current.fetchAll();
        });
        await act(async () => {
            await result.current.edit(0);
        });
        await act(async () => {
            await result.current.remove(0);
        });
        expect(deleteRelationMock).toHaveBeenCalledWith("p1", "t1");
        expect(deleteTagMock).toHaveBeenCalledWith({ id: "t1" });
        expect(result.current.extras.index).toBeNull();
    });
});
