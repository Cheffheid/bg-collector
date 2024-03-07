import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const boardgameRouter = createTRPCRouter({
  create: privateProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.boardgame.create({
        data: {
          authorId: ctx.currentUser,
          name: input.name,
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const games = await ctx.db.boardgame.findMany({
      take: 100,
    });

    return games;
  }),

  getAllFromUser: privateProcedure.query(async ({ ctx }) => {
    const games = await ctx.db.boardgame.findMany({
      take: 100,
      where: {
        authorId: ctx.currentUser,
      },
    });

    return games;
  }),
});
