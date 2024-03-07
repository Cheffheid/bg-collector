"use client";

import { unstable_noStore as noStore } from "next/cache";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Collection } from "./_components/collection";
import { AddBoardgame } from "./_components/add-boardgame";

export default function Home() {
  noStore();

  const user = useUser();

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="flex px-2 py-1">
        <h1>Boardgame Collector</h1>
        <div className="ml-auto">
          {!user.isSignedIn && <SignInButton />}
          {!!user.isSignedIn && <UserButton />}
        </div>
      </div>
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16">
        {!!user.isSignedIn && <AddBoardgame />}
        {!!user.isSignedIn && <Collection />}
      </div>
    </main>
  );
}
