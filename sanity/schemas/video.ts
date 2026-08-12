import { defineType, defineField } from "sanity";
export const video = defineType({
  name: "video", type: "document", title: "Video",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "url", type: "url", validation: (r) => r.required() }),
    defineField({ name: "language", type: "string", options: { list: ["pt", "es"] }, validation: (r) => r.required() }),
  ],
});
