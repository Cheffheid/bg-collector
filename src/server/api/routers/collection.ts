import { z } from "zod";
import { privateProcedure, createTRPCRouter } from "../trpc";

export const collectionRouter = createTRPCRouter({
  addToCollection: privateProcedure
    .input(
      z.object({
        gameId: z.number().gt(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.collection.create({
        data: {
          ownerId: ctx.currentUser,
          gameId: input.gameId,
        },
      });
    }),

  getCollection: privateProcedure.query(async ({ ctx }) => {
    const collection = await ctx.db.collection.findFirst({
      where: {
        ownerId: ctx.currentUser,
      },
    });

    return collection;
  }),
});
