import type { BlogData } from "@src/types/blog";

const PUBLIC_DATA_URL =
    "https://amplify-dfehxkleeewp6-mai-publiquestoragebucketac0-prayewhqq8bb.s3.eu-west-3.amazonaws.com/publique-storage/data2.json";

export async function fetchBlogData(): Promise<BlogData> {
    const res = await fetch(PUBLIC_DATA_URL, { cache: "force-cache" }); // pour SSG
    if (!res.ok) throw new Error(`Erreur fetch : ${res.status}`);
    return res.json();
}
