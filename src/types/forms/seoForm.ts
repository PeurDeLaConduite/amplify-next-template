import type { SeoOmit } from "../models/seo";

/**
 * Structure du formulaire SEO
 * - correspond aux champs modifiables de Seo (sans id, createdAt, etc.)
 */
export type SeoForm = SeoOmit;
