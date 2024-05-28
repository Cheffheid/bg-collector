import { z } from "zod";
import { privateProcedure, createTRPCRouter } from "../trpc";

export const collectionRouter = createTRPCRouter({
  addToCollection: privateProcedure
    .input(
      z.object({
        gameId: z.number().gt(0),
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.collection.upsert({
        where: {
          ownerId: ctx.currentUser,
        },
        update: {
          games: {
            connectOrCreate: {
              where: {
                id: input.gameId,
              },
              create: {
                id: input.gameId,
                title: input.title,
              },
            },
          },
        },
        create: {
          ownerId: ctx.currentUser,
          games: {
            connectOrCreate: {
              where: {
                id: input.gameId,
              },
              create: {
                id: input.gameId,
                title: input.title,
              },
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

  removeFromCollection: privateProcedure
    .input(
      z.object({
        gameId: z.number().gt(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.collection.update({
        where: {
          ownerId: ctx.currentUser,
        },
        data: {
          games: {
            disconnect: {
              id: input.gameId,
            },
          },
        },
      });
    }),
});
