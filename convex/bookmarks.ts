import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const listByUser = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, { userId }) => {
    const categories = await ctx.db
      .query('bookmarks')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const results = await Promise.all(
      categories.map(async (category) => {
        const links = await ctx.db
          .query('links')
          .withIndex('by_category', (q) => q.eq('categoryId', category._id))
          .collect();

        return { ...category, links };
      }),
    );

    return results;
  },
});

export const create = mutation({
  args: {
    userId: v.id('users'),
    title: v.string(),
  },
  handler: async (ctx, { userId, title }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return ctx.db.insert('bookmarks', {
      title,
      userId,
      createdAt: Date.now(),
    });
  },
});

export const updateTitle = mutation({
  args: {
    userId: v.id('users'),
    categoryId: v.id('bookmarks'),
    title: v.string(),
  },
  handler: async (ctx, { userId, categoryId, title }) => {
    const category = await ctx.db.get(categoryId);
    if (!category || category.userId !== userId) {
      throw new Error('Category not found');
    }

    await ctx.db.patch(categoryId, { title });
  },
});

export const remove = mutation({
  args: {
    userId: v.id('users'),
    categoryId: v.id('bookmarks'),
  },
  handler: async (ctx, { userId, categoryId }) => {
    const category = await ctx.db.get(categoryId);
    if (!category || category.userId !== userId) {
      throw new Error('Category not found');
    }

    const links = await ctx.db
      .query('links')
      .withIndex('by_category', (q) => q.eq('categoryId', categoryId))
      .collect();

    await Promise.all(links.map((link) => ctx.db.delete(link._id)));
    await ctx.db.delete(categoryId);
  },
});
