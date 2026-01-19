import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
  })
    .index('email', ['email'])
    .index('phone', ['phone']),
  bookmarks: defineTable({
    title: v.string(),
    userId: v.id('users'),
    createdAt: v.number(),
    sortIndex: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index('by_user', ['userId'])
    .index('by_user_sort', ['userId', 'sortIndex']),
  links: defineTable({
    url: v.string(),
    categoryId: v.id('bookmarks'),
    userId: v.id('users'),
    createdAt: v.number(),
    sortIndex: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index('by_category', ['categoryId'])
    .index('by_category_sort', ['categoryId', 'sortIndex'])
    .index('by_user', ['userId']),
});
