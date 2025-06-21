export interface Author {
    authorJsonId: string;
    name: string;
    avatar: string;
}

export interface Post {
    postJsonId: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    authorJsonId: string;
    sectionJsonIds: string[];
    relatedPostJsonIds: string[];
    videoUrl: string | null;
    tags: string[];
    type: string;
    status: string;
    seo: { title: string; description: string; image: string | null };
    createdAt: string;
    updatedAt: string;
}

export type Section = {
    sectionJsonId: string;
    title: string;
    slug: string;
    description: string;
    order: number;
    postJsonIds: string[];
    seo?: {
        title: string;
        description: string;
        image?: string;
    };
};

export interface BlogData {
    sections: Section[];
    posts: Post[];
    authors: Author[];
}

export interface BlogProps {
    data: BlogData;
    singlePost?: Post; // optionnel pour page article
}
export type Seo = {
    title: string;
    description: string;
    image: string;
};
