import { mutation } from './_generated/server';
import type { MutationCtx } from './_generated/server';
import { v } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';

async function requireAuthUserId(ctx: MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error('Unauthorized');
  }
  return userId;
}

export const create = mutation({
  args: {
    categoryId: v.id('bookmarks'),
    url: v.string(),
  },
  handler: async (ctx, { categoryId, url }) => {
    const userId = await requireAuthUserId(ctx);
    const category = await ctx.db.get(categoryId);
    if (!category || category.userId !== userId) {
      throw new Error('Category not found');
    }

    const existing = await ctx.db
      .query('links')
      .withIndex('by_category', (q) => q.eq('categoryId', categoryId))
      .collect();

    return ctx.db.insert('links', {
      url,
      categoryId,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      sortIndex: existing.length,
    });
  },
});

export const remove = mutation({
  args: {
    linkId: v.id('links'),
  },
  handler: async (ctx, { linkId }) => {
    const userId = await requireAuthUserId(ctx);
    const link = await ctx.db.get(linkId);
    if (!link || link.userId !== userId) {
      throw new Error('Link not found');
    }

    await ctx.db.delete(linkId);
  },
});

export const reorder = mutation({
  args: {
    categoryId: v.id('bookmarks'),
    orderedIds: v.array(v.id('links')),
  },
  handler: async (ctx, { categoryId, orderedIds }) => {
    const userId = await requireAuthUserId(ctx);
    const category = await ctx.db.get(categoryId);
    if (!category || category.userId !== userId) {
      throw new Error('Category not found');
    }

    const links = await ctx.db
      .query('links')
      .withIndex('by_category', (q) => q.eq('categoryId', categoryId))
      .collect();

    const linkIds = new Set(links.map((link) => link._id));
    const filtered = orderedIds.filter((linkId) => linkIds.has(linkId));

    if (filtered.length !== links.length) {
      throw new Error('Link list does not match category links');
    }

    await Promise.all(
      filtered.map((linkId, index) =>
        ctx.db.patch(linkId, { sortIndex: index, updatedAt: Date.now() }),
      ),
    );
  },
});

export const move = mutation({
  args: {
    linkId: v.id('links'),
    toCategoryId: v.id('bookmarks'),
    targetIndex: v.optional(v.number()),
  },
  handler: async (ctx, { linkId, toCategoryId, targetIndex }) => {
    const userId = await requireAuthUserId(ctx);
    const link = await ctx.db.get(linkId);
    if (!link || link.userId !== userId) {
      throw new Error('Link not found');
    }

    const destination = await ctx.db.get(toCategoryId);
    if (!destination || destination.userId !== userId) {
      throw new Error('Destination category not found');
    }

    const fromCategoryId = link.categoryId;
    const sourceLinks = await ctx.db
      .query('links')
      .withIndex('by_category', (q) => q.eq('categoryId', fromCategoryId))
      .collect();
    const destinationLinks =
      fromCategoryId === toCategoryId
        ? sourceLinks
        : await ctx.db
            .query('links')
            .withIndex('by_category', (q) => q.eq('categoryId', toCategoryId))
            .collect();
    const sortLinks = (links: typeof sourceLinks) =>
      [...links].sort(
        (a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0) || a.createdAt - b.createdAt,
      );
    const orderedSourceLinks = sortLinks(sourceLinks);
    const orderedDestinationLinks =
      fromCategoryId === toCategoryId ? orderedSourceLinks : sortLinks(destinationLinks);

    const sourceIds = orderedSourceLinks.map((item) => item._id);
    const sourceIndex = sourceIds.indexOf(linkId);
    if (sourceIndex === -1) {
      throw new Error('Link not found in source category');
    }

    const clampIndex = (value: number, max: number) => Math.max(0, Math.min(value, max));
    const baseTarget =
      targetIndex === undefined ? orderedDestinationLinks.length : Math.round(targetIndex);

    if (fromCategoryId === toCategoryId) {
      const nextIndex = clampIndex(baseTarget, sourceLinks.length - 1);
      if (nextIndex === sourceIndex) return;

      const nextOrder = sourceIds.filter((id) => id !== linkId);
      nextOrder.splice(nextIndex, 0, linkId);

      await Promise.all(
        nextOrder.map((id, index) => ctx.db.patch(id, { sortIndex: index, updatedAt: Date.now() })),
      );

      return;
    }

    const remainingSource = sourceIds.filter((id) => id !== linkId);
    const destinationIds = orderedDestinationLinks.map((item) => item._id);
    const insertIndex = clampIndex(baseTarget, destinationIds.length);
    destinationIds.splice(insertIndex, 0, linkId);

    await Promise.all([
      ...remainingSource.map((id, index) =>
        ctx.db.patch(id, { sortIndex: index, updatedAt: Date.now() }),
      ),
      ...destinationIds.map((id, index) => {
        if (id === linkId) {
          return ctx.db.patch(id, {
            categoryId: toCategoryId,
            sortIndex: index,
            updatedAt: Date.now(),
          });
        }

        return ctx.db.patch(id, { sortIndex: index, updatedAt: Date.now() });
      }),
    ]);
  },
});
