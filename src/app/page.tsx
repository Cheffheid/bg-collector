"use client";

import { unstable_noStore as noStore } from "next/cache";

import { SignInButton, useUser } from "@clerk/nextjs";
import { Collection } from "./_components/collection";
import { AddBoardgame } from "./_components/add-boardgame";
import { Suspense } from "react";
import { CollectionSkeleton } from "./_components/collectionSkeleton";
import { Header } from "./_components/header";

export default function Home() {
  noStore();

  const user = useUser();

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-6xl xl:px-0">
      <div className="flex h-screen flex-col justify-start">
        <Header />
        <div className="container mx-auto flex flex-col items-center divide-y divide-gray-200 dark:divide-gray-700">
          <HomeContent isSignedIn={user.isSignedIn} />
        </div>
      </div>
    </main>
  );
}

function HomeContent(props: { isSignedIn: boolean | undefined }) {
  if (!props.isSignedIn) {
    return <SignInButton />;
  }

  return (
    <>
      <AddBoardgame />
      <Suspense fallback={<CollectionSkeleton />}>
        <Collection />
      </Suspense>
    </>
  );
}
