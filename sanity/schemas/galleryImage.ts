import { defineType, defineField } from "sanity";
export const galleryImage = defineType({
  name: "galleryImage", type: "document", title: "Gallery Image",
  fields: [
    defineField({ name: "image", type: "image", validation: (r) => r.required() }),
    defineField({ name: "alt", type: "string", validation: (r) => r.required() }),
    defineField({ name: "language", type: "string", options: { list: ["pt", "es"] }, validation: (r) => r.required() }),
    defineField({ name: "order", type: "number" }),
  ],
});
