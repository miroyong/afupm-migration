import { defineField, defineType } from "sanity";

/**
 * Singleton with global site configuration (siteName, social links, footer
 * text). Create a single document of this type in the Studio.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Configurações do Site",
  type: "document",
  fields: [
    defineField({ name: "siteName", title: "Nome do Site", type: "string" }),
    defineField({ name: "siteDescription", title: "Descrição", type: "text" }),
    defineField({
      name: "socialLinks",
      title: "Links Sociais",
      type: "object",
      fields: [
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
      ],
    }),
    defineField({ name: "footerText", title: "Texto do Rodapé", type: "text" }),
  ],
});
