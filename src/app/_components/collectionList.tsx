import { api } from "~/trpc/react";
import { BoardgameView } from "./boardgameview";

export function CollectionList() {
  const [data] = api.boardgame.getAllFromUser.useSuspenseQuery();

  return (
    <div className="mx-auto w-full py-4 md:w-3/5">
      {!data.length && (
        <p>You&apos;ve not added anything to your collection yet!</p>
      )}
      {!!data.length &&
        data.map((game) => <BoardgameView {...game} key={game.id} />)}
    </div>
  );
}
