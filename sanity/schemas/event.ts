import { defineType, defineField } from "sanity";
export const event = defineType({
  name: "event", type: "document", title: "Event",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "description", type: "blockContent" }),
    defineField({ name: "date", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "endDate", type: "datetime" }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "image", type: "image" }),
    defineField({ name: "language", type: "string", options: { list: ["pt", "es"] }, validation: (r) => r.required() }),
  ],
});
