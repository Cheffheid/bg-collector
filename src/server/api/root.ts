import { boardgameRouter } from "~/server/api/routers/boardgame";
import { createTRPCRouter } from "~/server/api/trpc";
import { collectionRouter } from "./routers/collection";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  boardgame: boardgameRouter,
  collection: collectionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
