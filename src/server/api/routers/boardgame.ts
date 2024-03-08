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
      return ctx.db.boardgame.create({
        data: {
          authorId: ctx.currentUser,
          name: input.name,
        },
      });
    }),

  delete: privateProcedure
    .input(z.object({ id: z.number().int().positive().safe() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.boardgame.delete({
        where: {
          id: input.id,
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
