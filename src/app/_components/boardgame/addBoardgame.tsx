import React, { type Dispatch, type SetStateAction, useState } from "react";

import { api } from "~/trpc/react";

const defaultGame = {
  title: "",
  yearPublished: 0,
  id: 0,
};

export function AddBoardgame() {
  const [selectedGame, setSelectedGame] = useState(defaultGame);

  const ctx = api.useUtils();

  const addBoardgame = api.collection.addToCollection.useMutation({
    onSuccess: () => {
      setSelectedGame(defaultGame);
      void ctx.collection.getCollection.invalidate();
    },
  });

  return (
    <form className="relative mb-2 flex w-full flex-col pt-4 md:w-3/5">
      <div className="relative flex items-center justify-center pb-1">
        <BoardgameInput
          selectedGame={selectedGame}
          setSelectedGame={setSelectedGame}
        />
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
  selectedGame: {
    title: string;
    yearPublished: number;
    id: number;
  };
  setSelectedGame: Dispatch<
    SetStateAction<{ title: string; yearPublished: number; id: number }>
  >;
}) => {
  const [listHidden, setListHidden] = useState(true);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchText, setSearchText] = useState("");

  let { data: games } = api.boardgame.getGamesByTitle.useQuery({
    title: searchText,
  });

  if ("undefined" === typeof games) {
    games = [];
  }

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.code;
    let preventDefault = false;

    if ("ArrowDown" === key) {
      preventDefault = true;
      highlightNextItem();
    }

    if ("ArrowUp" === key) {
      preventDefault = true;
      highlightPreviousItem();
    }

    if ("Enter" === key) {
      preventDefault = true;

      selectTheGame();
      closeList();
    }

    if (preventDefault) {
      e.preventDefault();
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

  const closeList = () => {
    setActiveIndex(-1);
    setListHidden(true);
  };

  const selectTheGame = (forceCloseList = false) => {
    if (games && 0 < games.length && -1 !== activeIndex) {
      const selectedGame = games.at(activeIndex);

      if ("undefined" !== typeof selectedGame) {
        props.setSelectedGame(selectedGame);
      }
    }

    if (forceCloseList) {
      closeList();
    }
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
        value={props.selectedGame.title}
        onChange={(e) => {
          setSearchText(e.currentTarget.value);
        }}
        onFocus={() => setListHidden(false)}
        onKeyDown={handleKeydown}
        role="combobox"
        aria-controls="boardgame-list"
        aria-expanded="false"
        className="grow bg-slate-50 px-4 py-2 text-black transition focus:bg-white"
        autoComplete="off"
      />
      {!listHidden && games && (
        <ul
          aria-label="Boardgames"
          role="listbox"
          className="absolute top-full max-h-80 w-full overflow-y-auto bg-white"
          onMouseLeave={() => setActiveIndex(-1)}
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
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectTheGame(true)}
              className="cursor-pointer p-1 aria-selected:bg-indigo-200 aria-selected:text-neutral-950"
            >
              {game.title} ({game.yearPublished})
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
