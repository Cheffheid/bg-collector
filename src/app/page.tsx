"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { Collection } from "./_components/collection";
import { AddBoardgame } from "./_components/add-boardgame";
import { Suspense } from "react";
import { CollectionSkeleton } from "./_components/collectionSkeleton";
import { Header } from "./_components/header";

export default function Home() {
  const user = useUser();

  return (
    <main>
      <div className="flex h-screen flex-col justify-start">
        <Header />
        <div className="container mx-auto flex max-w-3xl flex-col items-center divide-y divide-gray-200 px-4 sm:px-6 xl:max-w-6xl xl:px-0 dark:divide-gray-700">
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
