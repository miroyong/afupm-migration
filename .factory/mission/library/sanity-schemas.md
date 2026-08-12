# Sanity Schema Reference

Document type definitions for the AFUPM migration.

## Schemas

### page
```typescript
{
  name: 'page',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'body', type: 'blockContent' },
    { name: 'language', type: 'string', options: { list: ['pt', 'es'] } },
  ]
}
```

### post
```typescript
{
  name: 'post',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'excerpt', type: 'text' },
    { name: 'body', type: 'blockContent' },
    { name: 'mainImage', type: 'image' },
    { name: 'categories', type: 'array', of: [{ type: 'reference', to: [{ type: 'postCategory' }] }] },
    { name: 'tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'language', type: 'string', options: { list: ['pt', 'es'] } },
    { name: 'featured', type: 'boolean' },
  ]
}
```

### postCategory
```typescript
{
  name: 'postCategory',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
  ]
}
```

### wordOfTheDay
```typescript
{
  name: 'wordOfTheDay',
  type: 'document',
  fields: [
    { name: 'phrase', type: 'text' },
    { name: 'order', type: 'number' },
    { name: 'language', type: 'string', options: { list: ['pt', 'es'] } },
  ]
}
```

### galleryImage
```typescript
{
  name: 'galleryImage',
  type: 'document',
  fields: [
    { name: 'image', type: 'image' },
    { name: 'alt', type: 'string' },
    { name: 'language', type: 'string', options: { list: ['pt', 'es'] } },
    { name: 'order', type: 'number' },
  ]
}
```

### event
```typescript
{
  name: 'event',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'description', type: 'blockContent' },
    { name: 'date', type: 'datetime' },
    { name: 'endDate', type: 'datetime' },
    { name: 'location', type: 'string' },
    { name: 'image', type: 'image' },
    { name: 'language', type: 'string', options: { list: ['pt', 'es'] } },
  ]
}
```

### video
```typescript
{
  name: 'video',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'url', type: 'url' },
    { name: 'language', type: 'string', options: { list: ['pt', 'es'] } },
  ]
}
```

### siteSettings
```typescript
{
  name: 'siteSettings',
  type: 'document',
  fields: [
    { name: 'siteName', type: 'string' },
    { name: 'siteDescription', type: 'text' },
    {
      name: 'socialLinks',
      type: 'object',
      fields: [
        { name: 'youtube', type: 'url' },
        { name: 'instagram', type: 'url' },
      ]
    },
    { name: 'footerText', type: 'text' },
  ]
}
```

## Shared Types

### blockContent
Rich text with images. Standard Sanity block content with image support.
