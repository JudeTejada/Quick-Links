import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
    userId: v.id('users'),
    categoryId: v.id('bookmarks'),
    url: v.string(),
  },
  handler: async (ctx, { userId, categoryId, url }) => {
    const category = await ctx.db.get(categoryId);
    if (!category || category.userId !== userId) {
      throw new Error('Category not found');
    }

    return ctx.db.insert('links', {
      url,
      categoryId,
      userId,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    userId: v.id('users'),
    linkId: v.id('links'),
  },
  handler: async (ctx, { userId, linkId }) => {
    const link = await ctx.db.get(linkId);
    if (!link || link.userId !== userId) {
      throw new Error('Link not found');
    }

    await ctx.db.delete(linkId);
  },
});
