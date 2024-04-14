import { api } from "~/trpc/react";
import { BoardgameView } from "./boardgame/boardgameView";

export function CollectionList() {
  const [data] = api.collection.getCollection.useSuspenseQuery();

  return (
    <div className="mx-auto w-full py-4 md:w-3/5">
      {!data?.games && (
        <p>You&apos;ve not added anything to your collection yet!</p>
      )}
      {!!data?.games &&
        data?.games.map((game) => <BoardgameView {...game} key={game.id} />)}
    </div>
  );
}
