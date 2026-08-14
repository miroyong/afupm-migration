import { createClient } from "@sanity/client";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "d67qfgu8";
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// ---- Content Pages ----
export async function getPage(slug: string, language: string) {
  const data = await client.fetch(
    `*[_type == "page" && slug.current == $slug && language == $language][0]`,
    { slug, language },
    { next: { revalidate: 60 } }
  );
  return data;
}

export async function getPages(language: string) {
  return client.fetch(
    `*[_type == "page" && language == $language] | order(title asc)`,
    { language },
    { next: { revalidate: 60 } }
  );
}

// Shared projection for post cards / lists. Resolves the main image URL and
// referenced categories so the UI does not need extra joins.
const POST_PROJECTION = `{
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  featured,
  "mainImageUrl": mainImage.asset->url,
  categories[]->{ _id, title, slug }
}`;

// ---- Posts ----
export async function getPosts(language: string, category?: string) {
  if (category) {
    return client.fetch(
      `*[_type == "post" && language == $language && $category in categories[]->slug.current] | order(publishedAt desc) ${POST_PROJECTION}`,
      { language, category },
      { next: { revalidate: 60 } }
    );
  }
  return client.fetch(
    `*[_type == "post" && language == $language] | order(publishedAt desc) ${POST_PROJECTION}`,
    { language },
    { next: { revalidate: 60 } }
  );
}

/**
 * Featured ("DESTAQUES") posts. When no posts are explicitly flagged featured,
 * falls back to the most recent posts so the section is never empty.
 */
export async function getFeaturedPosts(language: string, limit = 3) {
  const featured = await client.fetch(
    `*[_type == "post" && language == $language && featured == true] | order(publishedAt desc) [0...$limit] ${POST_PROJECTION}`,
    { language, limit },
    { next: { revalidate: 60 } }
  );
  if (featured && featured.length > 0) return featured;
  return client.fetch(
    `*[_type == "post" && language == $language] | order(publishedAt desc) [0...$limit] ${POST_PROJECTION}`,
    { language, limit },
    { next: { revalidate: 60 } }
  );
}

export async function getPost(slug: string, language: string) {
  const data = await client.fetch(
    `*[_type == "post" && slug.current == $slug && language == $language][0]{
      ..., categories[]->, "mainImageUrl": mainImage.asset->url
    }`,
    { slug, language },
    { next: { revalidate: 60 } }
  );
  return data;
}

export async function getPostCategories(language: string) {
  return client.fetch(
    `*[_type == "postCategory"] | order(title asc)`,
    {},
    { next: { revalidate: 3600 } }
  );
}

// ---- Gallery ----
export async function getGalleryImages(language: string) {
  return client.fetch(
    `*[_type == "galleryImage" && language == $language] | order(order asc) { _id, alt, "url": image.asset->url }`,
    { language },
    { next: { revalidate: 60 } }
  );
}

// ---- Events ----
export async function getEvents(language: string) {
  return client.fetch(
    `*[_type == "event" && language == $language] | order(date asc)`,
    { language },
    { next: { revalidate: 60 } }
  );
}

// ---- Videos ----
export async function getVideos(language: string) {
  return client.fetch(
    `*[_type == "video" && language == $language] | order(title asc)`,
    { language },
    { next: { revalidate: 3600 } }
  );
}

// ---- Site Settings ----
export async function getSiteSettings() {
  return client.fetch(
    `*[_type == "siteSettings"][0]`,
    {},
    { next: { revalidate: 3600 } }
  );
}
