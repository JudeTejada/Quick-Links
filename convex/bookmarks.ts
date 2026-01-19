import { mutation, query } from './_generated/server';
import type { MutationCtx, QueryCtx } from './_generated/server';
import { v } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';

type AuthCtx = MutationCtx | QueryCtx;

async function requireAuthUserId(ctx: AuthCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error('Unauthorized');
  }
  return userId;
}

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthUserId(ctx);
    const categories = await ctx.db
      .query('bookmarks')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    const sortedCategories = [...categories].sort(
      (a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0) || a.createdAt - b.createdAt,
    );

    const results = await Promise.all(
      sortedCategories.map(async (category) => {
        const links = await ctx.db
          .query('links')
          .withIndex('by_category', (q) => q.eq('categoryId', category._id))
          .collect();
        const sortedLinks = [...links].sort(
          (a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0) || a.createdAt - b.createdAt,
        );

        return { ...category, links: sortedLinks };
      }),
    );

    return results;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, { title }) => {
    const userId = await requireAuthUserId(ctx);
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const existing = await ctx.db
      .query('bookmarks')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    return ctx.db.insert('bookmarks', {
      title,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      sortIndex: existing.length,
    });
  },
});

export const updateTitle = mutation({
  args: {
    categoryId: v.id('bookmarks'),
    title: v.string(),
  },
  handler: async (ctx, { categoryId, title }) => {
    const userId = await requireAuthUserId(ctx);
    const category = await ctx.db.get(categoryId);
    if (!category || category.userId !== userId) {
      throw new Error('Category not found');
    }

    await ctx.db.patch(categoryId, { title, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: {
    categoryId: v.id('bookmarks'),
  },
  handler: async (ctx, { categoryId }) => {
    const userId = await requireAuthUserId(ctx);
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

export const reorder = mutation({
  args: {
    orderedIds: v.array(v.id('bookmarks')),
  },
  handler: async (ctx, { orderedIds }) => {
    const userId = await requireAuthUserId(ctx);
    if (!orderedIds.length) return;

    const categories = await ctx.db
      .query('bookmarks')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const categoryIds = new Set(categories.map((category) => category._id));
    const filtered = orderedIds.filter((categoryId) => categoryIds.has(categoryId));

    if (filtered.length !== categories.length) {
      throw new Error('Category list does not match user categories');
    }

    await Promise.all(
      filtered.map((categoryId, index) =>
        ctx.db.patch(categoryId, { sortIndex: index, updatedAt: Date.now() }),
      ),
    );
  },
});
