import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export function Header() {
  const user = useUser();

  return (
    <header className="flex items-center justify-between py-10 print:hidden">
      <h1 className="flex items-center text-4xl">
        🎲
        <span className="ml-2 text-xl font-bold">Boardgame Collector</span>
      </h1>
      <div className="ml-5 flex">
        <Link href="/">Home</Link>
        <Link href="/scoring" className="ml-8">
          Scoring Helpers
        </Link>
      </div>
      <div className="ml-auto">{!!user.isSignedIn && <UserButton />}</div>
    </header>
  );
}
