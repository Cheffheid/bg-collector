import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";

type Boardgame = RouterOutputs["boardgame"]["getAll"][number];

export const BoardgameView = (props: Boardgame) => {
  const { id, name } = props;

  const ctx = api.useUtils();

  const deleteBoardgame = api.boardgame.delete.useMutation({
    onSuccess: () => {
      void ctx.boardgame.getAllFromUser.invalidate();
    },
  });

  return (
    <div key={id} className="flex gap-3 border-b border-slate-400 p-4">
      <div className="flex w-full justify-between">
        {name}
        <button
          type="button"
          className=""
          onClick={() => {
            deleteBoardgame.mutate({ id });
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};
