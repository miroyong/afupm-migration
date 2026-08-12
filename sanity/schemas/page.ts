import { defineType, defineField } from 'sanity';

export const page = defineType({
  name: 'page',
  type: 'document',
  title: 'Page',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'body', type: 'blockContent' }),
    defineField({ name: 'language', type: 'string', options: { list: ['pt', 'es'] }, validation: (r) => r.required() }),
  ],
});
