"use client";

import { unstable_noStore as noStore } from "next/cache";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Collection } from "./_components/collection";
import { AddBoardgame } from "./_components/add-boardgame";
import { Suspense } from "react";
import { CollectionSkeleton } from "./_components/collectionSkeleton";

export default function Home() {
  noStore();

  const user = useUser();

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <div className="flex h-screen flex-col justify-start">
        <header className="flex items-center justify-between py-10 text-4xl print:hidden">
          <h1>
            🎲
            <span className="sr-only">Boardgame Collector</span>
          </h1>
          <div className="ml-auto">{!!user.isSignedIn && <UserButton />}</div>
        </header>
        <div className="container mx-auto flex flex-col items-center divide-y divide-gray-200 dark:divide-gray-700">
          {!user.isSignedIn && <SignInButton />}
          {!!user.isSignedIn && <AddBoardgame />}
          {!!user.isSignedIn && (
            <Suspense fallback={<CollectionSkeleton />}>
              <Collection />
            </Suspense>
          )}
        </div>
      </div>
    </main>
  );
}
