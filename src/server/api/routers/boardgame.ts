import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const boardgameRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        id: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.boardgame.create({
        data: {
          id: input.id,
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
      orderBy: [{ id: "asc" }],
    });

    return games;
  }),
});
