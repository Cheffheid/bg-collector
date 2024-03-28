import { Header } from "./_components/header";

export default function Home() {
  return (
    <main>
      <div className="flex h-screen flex-col justify-start">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex max-w-7xl flex-col items-center divide-y divide-gray-200 px-4 py-6 lg:px-8 xl:max-w-6xl xl:px-0 dark:divide-gray-700"></div>
        </div>
      </div>
    </main>
  );
}
