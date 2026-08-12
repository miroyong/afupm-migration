import { defineType, defineField } from "sanity";
export const postCategory = defineType({
  name: "postCategory", type: "document", title: "Post Category",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
  ],
});
