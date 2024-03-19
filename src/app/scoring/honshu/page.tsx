"use client";

import { Header } from "~/app/_components/header";

export default function Honshu() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-6xl xl:px-0">
      <div className="flex h-screen flex-col justify-start">
        <Header />
        <div className="container mx-auto flex flex-col items-center divide-y divide-gray-200 dark:divide-gray-700">
          Honshu
        </div>
      </div>
    </main>
  );
}
