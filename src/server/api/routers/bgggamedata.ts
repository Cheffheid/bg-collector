import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const bggBaseUrl = "https://api.geekdo.com/xmlapi";

export const bggGameDataRouter = createTRPCRouter({
  getGameByID: publicProcedure
    .input(z.object({ id: z.number().gt(0) }))
    .query(async ({ input }) => {
      const gameData = await fetch(`${bggBaseUrl}/boardgame/${input.id}`).then(
        (response) => response.text(),
      );

      return gameData;
    }),

  getGamesBySearch: publicProcedure
    .input(z.object({ title: z.string() }))
    .query(async ({ input }) => {
      const games = await fetch(
        `${bggBaseUrl}/search?search=${input.title}`,
      ).then((response) => response.text());

      return games;
    }),
});
