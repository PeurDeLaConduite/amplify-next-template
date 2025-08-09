import { fetchBlogData } from "@src/services";
import type { Metadata, ResolvingMetadata } from "next";
import PostContent from "@components/Blog/PostContent";
import { BackButton } from "@components/buttons/Buttons";

export async function generateStaticParams() {
    const { sections } = await fetchBlogData();
    return sections.map((section) => ({ slug: section.slug }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const { sections, posts } = await fetchBlogData();

    const section = sections.find((s) => s.slug === slug)!;
    const seo = section.seo ?? {
        title: section.title,
        description: section.description,
        image: undefined,
    };

    const parentMeta = await parent;
    const previousImages = parentMeta.openGraph?.images || [];

    const titles =
        section.postJsonIds
            ?.map((id) => posts.find((p) => p.postJsonId === id)?.title)
            .filter(Boolean)
            .join(" • ") || "";

    return {
        title: seo.title || section.title,
        description: `${seo.description || section.description}${
            titles ? " | Articles : " + titles : ""
        }`,
        openGraph: {
            images: seo.image ? [seo.image, ...previousImages] : previousImages,
        },
    };
}

export default async function SectionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { sections, posts, authors } = await fetchBlogData();

    const section = sections.find((s) => s.slug === slug)!;
    const postsInSection = posts.filter(
        (post) => post.status === "published" && post.sectionJsonIds.includes(section.sectionJsonId)
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-1">{section.title}</h1>
            <p className="text-gray-600 mb-8">{section.description}</p>

            <div className="space-y-16">
                {postsInSection.map((post) => {
                    const author = authors.find((a) => a.authorJsonId === post.authorJsonId)!;
                    return <PostContent key={post.postJsonId} post={post} author={author} />;
                })}
            </div>

            <div className="text-right mt-12">
                <BackButton href="/blog" label="Retour" className="inline-block" />
            </div>
        </div>
    );
}
