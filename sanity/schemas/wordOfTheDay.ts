import { defineField, defineType } from "sanity";

export const LANGUAGE_OPTIONS = [
  { title: "Português", value: "pt" },
  { title: "Español", value: "es" },
];

/**
 * Daily rotating phrase shown on the home page ("Palavra do Dia"),
 * migrated from the Wix "TrueParentsWordsSlideshow" collection.
 * `order` determines the rotation sequence; the frontend rotates
 * deterministically by UTC date.
 */
export const wordOfTheDay = defineType({
  name: "wordOfTheDay",
  title: "Palavra do Dia",
  type: "document",
  fields: [
    defineField({
      name: "phrase",
      title: "Frase",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Ordem",
      type: "number",
      description: "Determina a sequência de rotação diária",
    }),
    defineField({
      name: "language",
      title: "Idioma",
      type: "string",
      options: { list: LANGUAGE_OPTIONS },
      initialValue: "pt",
    }),
  ],
  preview: {
    select: { title: "phrase", language: "language", order: "order" },
    prepare: (selection) => ({
      title: selection.title,
      subtitle: `${selection.language ?? "pt"} · ordem ${selection.order ?? "—"}`,
    }),
  },
});
