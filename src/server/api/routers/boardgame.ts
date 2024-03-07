import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const boardgameRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const authorId = "userId";

      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.boardgame.create({
        data: {
          authorId,
          name: input.name,
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.boardgame.findMany();
  }),
});
