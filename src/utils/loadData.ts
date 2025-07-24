// src/utils/loadData.ts
import { fetchBlogDataFromAmplify } from "./fetchBlogDataFromAmplify";
import type { Section, Post, Author } from "@src/types/blog";

export async function loadData(): Promise<{
    sections: Section[];
    posts: Post[];
    authors: Author[];
}> {
    return await fetchBlogDataFromAmplify();
}
