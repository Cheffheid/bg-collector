import Link from "next/link";

import { Header } from "../_components/header";
import { PageHeader } from "../_components/pageHeader";

export default function Scoring() {
  return (
    <main>
      <div className="flex h-screen flex-col justify-start">
        <Header />
        <PageHeader
          pageTitle="Score Helpers"
          pageDescription="Helpful score calculators for different games."
        />
        <div className="container mx-auto flex max-w-3xl items-center divide-y divide-gray-200 px-4 sm:px-6 xl:max-w-6xl xl:px-0 dark:divide-gray-700">
          <Link
            href="/scoring/honshu"
            className="group/card w-1/4 rounded-sm border-slate-400 bg-white p-4 transition-colors hover:bg-slate-200 focus:bg-slate-200"
          >
            <h2 className="flex justify-between text-xl">
              Honshu
              <span
                aria-hidden="true"
                className="inline-block transition-transform group-hover/card:translate-x-1 group-focus/card:translate-x-1"
              >
                -&gt;
              </span>
            </h2>
          </Link>
        </div>
      </div>
    </main>
  );
}
