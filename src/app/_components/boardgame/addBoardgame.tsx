import React, { type Dispatch, type SetStateAction, useState } from "react";

import { api } from "~/trpc/react";

interface minimumBoardgame {
  id: number;
  title: string;
  yearPublished: number;
}

const defaultGame = {
  title: "",
  yearPublished: 0,
  id: 0,
};

export function AddBoardgame() {
  const [selectedGame, setSelectedGame] = useState(defaultGame);
  const [searchText, setSearchText] = useState("");

  const ctx = api.useUtils();

  const addBoardgame = api.collection.addToCollection.useMutation({
    onSuccess: () => {
      setSelectedGame(defaultGame);
      setSearchText("");
      void ctx.collection.getCollection.invalidate();
    },
  });

  const currentCollection = api.collection.getCollection.useQuery();
  let currentCollectionIds = currentCollection?.data?.games.map(
    (game) => game.id,
  );

  if ("undefined" === typeof currentCollectionIds) {
    currentCollectionIds = [];
  }

  return (
    <form
      className="relative mb-2 flex w-full flex-col pt-4 md:w-3/5"
      onSubmit={(e) => {
        e.preventDefault();

        if (selectedGame.id && 0 !== selectedGame.id) {
          addBoardgame.mutate({
            gameId: selectedGame.id,
            title: selectedGame.title,
          });
        }
      }}
    >
      <div className="relative flex items-center justify-center pb-1">
        <BoardgameInput
          selectedGame={selectedGame}
          setSelectedGame={setSelectedGame}
          searchText={searchText}
          setSearchText={setSearchText}
          currentCollection={currentCollectionIds}
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

const parseGamesXML = (gamesXML: string) => {
  if (!gamesXML || "" === gamesXML) {
    return [];
  }

  const parser = new DOMParser();
  const parsedXML = parser.parseFromString(gamesXML, "text/xml");
  const errorNode = parsedXML.querySelector("error");

  if (errorNode) {
    return [];
  }

  const gameData: minimumBoardgame[] = [];
  const foundGames = parsedXML.querySelectorAll("boardgame");

  foundGames.forEach((game) => {
    const id = game.getAttribute("objectid");

    if (!id) {
      return;
    }

    const titleElement = game.querySelector("name");
    const publishedElement = game.querySelector("yearpublished");
    const title = titleElement ? titleElement.innerHTML : "";
    const yearPublished = publishedElement ? publishedElement.innerHTML : "0";

    gameData.push({
      id: parseInt(id, 10),
      title,
      yearPublished: parseInt(yearPublished, 10),
    });
  });

  return gameData;
};

const BoardgameInput = (props: {
  selectedGame: {
    title: string;
    yearPublished: number;
    id: number;
  };
  setSelectedGame: Dispatch<SetStateAction<minimumBoardgame>>;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  currentCollection: number[];
}) => {
  const [listHidden, setListHidden] = useState(true);
  const [activeIndex, setActiveIndex] = useState(-1);
  let games: minimumBoardgame[] = [];

  const { data: gamesXML } = api.bgggamedata.getGamesBySearch.useQuery({
    title: props.searchText,
  });

  if (gamesXML) {
    games = parseGamesXML(gamesXML);
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
        props.setSearchText(selectedGame.title);
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
        value={props.searchText}
        onChange={(e) => {
          props.setSearchText(e.currentTarget.value);

          if ("" !== e.currentTarget.value) {
            setListHidden(false);
          } else {
            setListHidden(true);
          }
        }}
        onBlur={() => setListHidden(true)}
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
              onMouseDown={() => {
                if (!props.currentCollection.includes(game.id)) {
                  selectTheGame(true);
                }
              }}
              className={
                props.currentCollection.includes(game.id)
                  ? "cursor-default p-1 text-neutral-400"
                  : "cursor-pointer p-1 aria-selected:bg-indigo-200 aria-selected:text-neutral-950"
              }
            >
              {game.title}{" "}
              {0 !== game.yearPublished && `(${game.yearPublished})`}
              {props.currentCollection.includes(game.id) && " (Already added)"}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
