"use client";

import { api } from "~/trpc/react";

export function Collection() {
  const { data } = api.boardgame.getAll.useQuery();

  return <>{data?.map((game) => <div key={game.id}>{game.name}</div>)}</>;
}
