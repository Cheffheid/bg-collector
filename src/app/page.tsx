"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { Collection } from "./_components/collection";
import { AddBoardgame } from "./_components/add-boardgame";
import { Suspense } from "react";
import { CollectionSkeleton } from "./_components/collectionSkeleton";
import { Header } from "./_components/header";
import { PageHeader } from "./_components/pageHeader";

export default function Home() {
  const user = useUser();

  return (
    <main>
      <div className="flex h-screen flex-col justify-start">
        <Header />
        <PageHeader
          pageTitle="Your Collection"
          pageDescription="Make sure you sign in first!"
        />
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex max-w-7xl flex-col items-center divide-y divide-gray-200 px-4 py-6 lg:px-8 xl:max-w-6xl xl:px-0 dark:divide-gray-700">
            <HomeContent isSignedIn={user.isSignedIn} />
          </div>
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
