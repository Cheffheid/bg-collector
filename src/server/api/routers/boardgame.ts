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
        title: z.string().min(1),
        yearPublished: z.number().gte(4),
        minPlayers: z.number().gt(0),
        maxPlayers: z.number().gt(0),
        playingTime: z.number().gt(0),
        complexity: z.number().gt(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.boardgame.create({
        data: {
          title: input.title,
          yearPublished: input.yearPublished,
          minPlayers: input.minPlayers,
          maxPlayers: input.maxPlayers,
          playingTime: input.playingTime,
          complexity: input.complexity,
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
});
