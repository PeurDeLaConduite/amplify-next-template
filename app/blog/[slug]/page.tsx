// app/blog/[slug]/page.tsx
import { fetchBlogDataFromAmplify } from "@utils/fetchBlogDataFromAmplify";
import type { Metadata, ResolvingMetadata } from "next";
import Blog from "@components/Blog/Blog";
import { BackButton } from "@/src/components/buttons/Buttons";
type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateStaticParams() {
    const { posts } = await fetchBlogDataFromAmplify();
    return posts.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // 1) await les params (Next 15 les rend asynchrones)
    const { slug } = await params;

    // 2) chargez vos données
    const { posts } = await fetchBlogDataFromAmplify();
    const post = posts.find((p) => p.slug === slug)!;

    // 3) vous pouvez étendre le metadata parent si besoin
    const parentMeta = await parent;
    const previousImages = parentMeta.openGraph?.images || [];

    return {
        title: post.seo.title,
        description: post.seo.description,
        openGraph: {
            images: post.seo.image ? [post.seo.image, ...previousImages] : previousImages,
        },
    };
}

// 4) Page component — `params` est une Promise
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // ❗️ ici aussi tu avais oublié `await`
    const { sections, posts, authors } = await fetchBlogDataFromAmplify();

    const post = posts.find((p) => p.slug === slug)!;

    return (
        <>
            <Blog data={{ sections, posts, authors }} singlePost={post} />{" "}
            <div className="text-right mb-6">
                <BackButton href="/blog" label="Retour" className="inline-block" />
            </div>
        </>
    );
}
