import { defineType, defineField } from "sanity";
export const post = defineType({
  name: "post", type: "document", title: "Post",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "excerpt", type: "text" }),
    defineField({ name: "body", type: "blockContent" }),
    defineField({ name: "mainImage", type: "image" }),
    defineField({ name: "categories", type: "array", of: [{ type: "reference", to: [{ type: "postCategory" }] }] }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "publishedAt", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "language", type: "string", options: { list: ["pt", "es"] }, validation: (r) => r.required() }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
  ],
});
