"use client";

import { api } from "~/trpc/react";
import { BoardgameView } from "./boardgameview";

export function Collection() {
  const { data } = api.boardgame.getAllFromUser.useQuery();

  return (
    <div className="container mx-auto md:max-w-5xl">
      {data?.map((game) => <BoardgameView {...game} key={game.id} />)}
    </div>
  );
}
