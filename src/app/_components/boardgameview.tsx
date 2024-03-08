import type { RouterOutputs } from "~/trpc/shared";

type Boardgame = RouterOutputs["boardgame"]["getAll"][number];

export const BoardgameView = (props: Boardgame) => {
  const { id, name } = props;
  return (
    <div key={id} className="flex gap-3 border-b border-slate-400 p-4">
      <div className="flex flex-col">
        <div className="flex gap-1">{name}</div>
      </div>
    </div>
  );
};
