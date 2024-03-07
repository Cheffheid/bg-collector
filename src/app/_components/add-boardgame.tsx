"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function AddBoardgame() {
  const router = useRouter();
  const [name, setName] = useState("");

  const addBoardgame = api.boardgame.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addBoardgame.mutate({ name });
      }}
      className="flex"
    >
      <input
        type="text"
        placeholder="Add a game!"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={addBoardgame.isLoading}
      >
        {addBoardgame.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
