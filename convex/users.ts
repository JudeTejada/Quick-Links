import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const upsertByEmail = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .unique();

    if (existing) {
      return { userId: existing._id, email: existing.email };
    }

    const userId = await ctx.db.insert('users', {
      email,
      createdAt: Date.now(),
    });

    return { userId, email };
  },
});
