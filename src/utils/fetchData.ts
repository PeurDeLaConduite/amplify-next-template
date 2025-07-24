import type { BlogData } from "@src/types/blog";
import { fetchBlogDataFromAmplify } from "./fetchBlogDataFromAmplify";

export async function fetchBlogData(): Promise<BlogData> {
    return fetchBlogDataFromAmplify();
}
