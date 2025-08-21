import { describe, it, expect, vi, beforeEach } from "vitest";
import type { PostType } from "@entities/models/post/types";
import { createPostManager } from "@entities/models/post/manager";
import { postService } from "@entities/models/post/service";
import { postTagService } from "@entities/relations/postTag/service";
import { sectionPostService } from "@entities/relations/sectionPost/service";

vi.mock("@entities/models/post/service", () => ({
    postService: {
        get: vi.fn(),
    },
}));

vi.mock("@entities/relations/postTag/service", () => ({
    postTagService: {
        listByParent: vi.fn(),
    },
}));

vi.mock("@entities/relations/sectionPost/service", () => ({
    sectionPostService: {
        listByChild: vi.fn(),
    },
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("post manager", () => {
    it("charge les tagIds et sectionIds existants", async () => {
        const post: PostType = {
            id: "p1",
            slug: "slug",
            title: "titre",
            excerpt: "extrait",
            content: "contenu",
            status: "draft",
            authorId: "a1",
            order: 1,
            videoUrl: "",
            type: "type",
            seo: {},
        } as unknown as PostType;

        (postService.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: post });
        (postTagService.listByParent as ReturnType<typeof vi.fn>).mockResolvedValue([
            "tag1",
            "tag2",
        ]);
        (sectionPostService.listByChild as ReturnType<typeof vi.fn>).mockResolvedValue([
            "section1",
        ]);

        const manager = createPostManager();
        await manager.loadEntityById("p1");

        expect(postService.get).toHaveBeenCalledWith({ id: "p1" });
        expect(postTagService.listByParent).toHaveBeenCalledWith("p1");
        expect(sectionPostService.listByChild).toHaveBeenCalledWith("p1");
        expect(manager.form.tagIds).toEqual(["tag1", "tag2"]);
        expect(manager.form.sectionIds).toEqual(["section1"]);
    });
});
