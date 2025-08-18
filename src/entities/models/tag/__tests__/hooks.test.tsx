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
});
