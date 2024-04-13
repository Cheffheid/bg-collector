import React, { useState } from "react";

import { api } from "~/trpc/react";

export function AddBoardgame() {
  const [name, setName] = useState("");

  const ctx = api.useUtils();

  const addBoardgame = api.collection.addToCollection.useMutation({
    onSuccess: () => {
      setName("");
      void ctx.collection.getCollection.invalidate();
    },
  });

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  return (
    <form className="relative mb-2 flex w-full flex-col pt-4 md:w-3/5">
      <div className="relative flex items-center justify-center pb-1">
        <BoardgameInput onChangeCallback={handleInputChange} name={name} />
        <button
          type="submit"
          className="absolute right-[1px] bg-slate-50 px-10 py-[6px] font-semibold transition hover:bg-slate-600 hover:text-white focus:bg-slate-600 focus:text-white"
          disabled={addBoardgame.isLoading}
        >
          {addBoardgame.isLoading ? "Submitting..." : "Add"}
        </button>
      </div>
    </form>
  );
}

const BoardgameInput = (props: {
  onChangeCallback: (e: React.FormEvent<HTMLInputElement>) => void;
  name: string;
}) => {
  const [listHidden, setListHidden] = useState(true);

  return (
    <>
      <label htmlFor="boardgame-input" id="boardgame-label" className="sr-only">
        Add a game!
      </label>
      <input
        id="boardgame-input"
        type="text"
        placeholder="Add a game!"
        value={props.name}
        onChange={props.onChangeCallback}
        onFocus={() => setListHidden(false)}
        onBlur={() => setListHidden(true)}
        role="combobox"
        aria-controls="boardgame-list"
        aria-expanded="false"
        className="grow bg-slate-50 px-4 py-2 text-black transition focus:bg-white"
      />
      <BoardgameList searchText={props.name} listHidden={listHidden} />
    </>
  );
};

const BoardgameList = ({
  searchText,
  listHidden,
}: {
  searchText: string;
  listHidden: boolean;
}) => {
  if (listHidden) {
    return <></>;
  }

  const { data: games } = api.boardgame.getGamesByTitle.useQuery({
    title: searchText,
  });

  if (!games) {
    return <></>;
  }

  return (
    <ul
      aria-label="Boardgames"
      role="listbox"
      className="absolute top-full max-h-80 w-full overflow-y-auto bg-white"
    >
      {games.map((game) => (
        <li key={game.id} role="option" aria-selected="false" className="p-1">
          {game.title} ({game.yearPublished})
        </li>
      ))}
    </ul>
  );
};
