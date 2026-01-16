import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    email: v.string(),
    createdAt: v.number(),
  }).index('by_email', ['email']),
  bookmarks: defineTable({
    title: v.string(),
    userId: v.id('users'),
    createdAt: v.number(),
  }).index('by_user', ['userId']),
  links: defineTable({
    url: v.string(),
    categoryId: v.id('bookmarks'),
    userId: v.id('users'),
    createdAt: v.number(),
  })
    .index('by_category', ['categoryId'])
    .index('by_user', ['userId']),
});
