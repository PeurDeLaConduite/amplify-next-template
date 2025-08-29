// app/blog/page.tsx

import BlogClientWrapper from "./BlogClientWrapper";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Blog",
};

export default function BlogPage() {
    return <BlogClientWrapper />;
}
