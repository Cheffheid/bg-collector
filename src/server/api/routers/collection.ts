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
      return ctx.db.collection.upsert({
        where: {
          ownerId: ctx.currentUser,
        },
        update: {
          games: {
            connect: {
              id: input.gameId,
            },
          },
        },
        create: {
          ownerId: ctx.currentUser,
          games: {
            connect: {
              id: input.gameId,
            },
          },
        },
      });
    }),

  getCollection: privateProcedure.query(async ({ ctx }) => {
    const collection = await ctx.db.collection.findFirst({
      where: {
        ownerId: ctx.currentUser,
      },
      select: {
        id: true,
        games: true,
      },
    });

    return collection;
  }),
});
