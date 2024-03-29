import { useState } from "react";

import { api } from "~/trpc/react";

export function AddBoardgame() {
  const [name, setName] = useState("");

  const ctx = api.useUtils();

  const addBoardgame = api.boardgame.create.useMutation({
    onSuccess: () => {
      setName("");
      void ctx.boardgame.getAllFromUser.invalidate();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if ("" !== name) {
          addBoardgame.mutate({ name });
        }
      }}
      className="relative mb-2 flex w-full items-center justify-center pt-4 md:w-3/5"
    >
      <input
        type="text"
        placeholder="Add a game!"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if ("Enter" === e.key) {
            e.preventDefault();

            if ("" !== name) {
              addBoardgame.mutate({ name });
            }
          }
        }}
        className="grow bg-slate-50 px-4 py-2 text-black transition focus:bg-white"
      />
      <button
        type="submit"
        className="absolute right-[1px] bg-slate-50 px-10 py-[6px] font-semibold transition hover:bg-slate-600 hover:text-white focus:bg-slate-600 focus:text-white"
        disabled={addBoardgame.isLoading}
      >
        {addBoardgame.isLoading ? "Submitting..." : "Add"}
      </button>
    </form>
  );
}
