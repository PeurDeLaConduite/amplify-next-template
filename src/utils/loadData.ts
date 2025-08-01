// src/utils/loadData.ts
import { fetchBlogData } from "@/src/services";
import type { Section, Post, Author } from "@src/types/blog";

export async function loadBlogData(): Promise<{
    sections: Section[];
    posts: Post[];
    authors: Author[];
}> {
    return await fetchBlogData();
}
