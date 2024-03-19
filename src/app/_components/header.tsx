import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between py-10 print:hidden">
      <p className="flex items-center text-4xl">
        <span aria-hidden="true">🎲</span>
        <span className="ml-2 text-xl font-bold">Boardgame Collector</span>
      </p>
      <div className="ml-5 flex">
        <Link href="/">Home</Link>
        <Link href="/scoring" className="ml-8">
          Scoring Helpers
        </Link>
      </div>
      <div className="ml-auto">
        <UserButton />
      </div>
    </header>
  );
}
