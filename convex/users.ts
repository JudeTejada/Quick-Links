import { query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    return {
      id: user._id,
      email: user.email ?? null,
      name: user.name ?? null,
      image: user.image ?? null,
    };
  },
});
