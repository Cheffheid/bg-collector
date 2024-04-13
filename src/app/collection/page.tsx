"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { CollectionList } from "../_components/collectionList";
import { AddBoardgame } from "../_components/boardgame/addBoardgame";
import { Suspense } from "react";
import { CollectionSkeleton } from "../_components/collectionSkeleton";
import { Header } from "../_components/header";
import { PageHeader } from "../_components/pageHeader";

export default function Collection() {
  const user = useUser();
  let headerDescription = "";

  if (!user.isSignedIn) {
    headerDescription = "Make sure you sign in first!";
  }

  return (
    <main>
      <div className="flex h-screen flex-col justify-start">
        <Header />
        <PageHeader
          pageTitle="Your Collection"
          pageDescription={headerDescription}
        />
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex max-w-7xl flex-col items-center divide-y divide-gray-200 px-4 py-6 lg:px-8 xl:max-w-6xl xl:px-0 dark:divide-gray-700">
            <CollectionContent isSignedIn={user.isSignedIn} />
          </div>
        </div>
      </div>
    </main>
  );
}

function CollectionContent(props: { isSignedIn: boolean | undefined }) {
  if (!props.isSignedIn) {
    return <SignInButton />;
  }

  return (
    <>
      <AddBoardgame />
      <Suspense fallback={<CollectionSkeleton />}>
        <CollectionList />
      </Suspense>
    </>
  );
}
