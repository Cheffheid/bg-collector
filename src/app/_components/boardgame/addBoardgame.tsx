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
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchText, setSearchText] = useState("");

  const { data: games } = api.boardgame.getGamesByTitle.useQuery({
    title: searchText,
  });

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.code;

    if (!games || 0 === games.length) {
      return;
    }

    if ("ArrowUp" !== key && "ArrowDown" !== key) {
      return;
    }

    if ("ArrowDown" === key) {
      highlightNextItem();
    }

    if ("ArrowUp" === key) {
      highlightPreviousItem();
    }
  };

  const highlightNextItem = () => {
    if (!games) {
      return;
    }

    let newIndex = activeIndex + 1;

    if (newIndex > games.length - 1) {
      newIndex = 0;
    }

    setActiveIndex(newIndex);
  };

  const highlightPreviousItem = () => {
    if (!games) {
      return;
    }

    let newIndex = activeIndex - 1;

    if (0 > newIndex) {
      newIndex = games.length - 1;
    }

    setActiveIndex(newIndex);
  };

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
        onChange={(e) => {
          setSearchText(e.currentTarget.value);
          props.onChangeCallback(e);
        }}
        onFocus={() => setListHidden(false)}
        onBlur={() => {
          setActiveIndex(-1);
          setListHidden(true);
        }}
        onKeyDown={handleKeydown}
        role="combobox"
        aria-controls="boardgame-list"
        aria-expanded="false"
        className="grow bg-slate-50 px-4 py-2 text-black transition focus:bg-white"
      />
      {!listHidden && games && (
        <BoardgameList games={games} activeIndex={activeIndex} />
      )}
    </>
  );
};

const BoardgameList = ({
  games,
  activeIndex,
}: {
  games: {
    title: string;
    yearPublished: number;
    id: number;
  }[];
  activeIndex: number;
}) => {
  return (
    <ul
      aria-label="Boardgames"
      role="listbox"
      className="absolute top-full max-h-80 w-full overflow-y-auto bg-white"
      aria-activedescendant={
        -1 !== activeIndex ? `gamelistitem-${activeIndex}` : ""
      }
    >
      {games.map((game, index) => (
        <li
          key={game.id}
          id={`gamelistitem-${index}`}
          role="option"
          aria-selected={index === activeIndex ? "true" : "false"}
          className="cursor-pointer p-1 hover:bg-indigo-200 hover:text-neutral-950 aria-selected:bg-indigo-200 aria-selected:text-neutral-950"
        >
          {game.title} ({game.yearPublished})
        </li>
      ))}
    </ul>
  );
};
