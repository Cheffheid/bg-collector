"use client";

import { api } from "~/trpc/react";
import { BoardgameView } from "./boardgameview";

export function Collection() {
  const [data] = api.boardgame.getAllFromUser.useSuspenseQuery();

  return (
    <div className="mx-auto w-full py-4 md:w-3/5">
      {data?.map((game) => <BoardgameView {...game} key={game.id} />)}
    </div>
  );
}
