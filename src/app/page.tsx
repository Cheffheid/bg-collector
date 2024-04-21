"use client";

import Image from "next/image";
import { Header } from "./_components/header";

export default function Home() {
  return (
    <main>
      <div className="flex h-screen flex-col justify-start">
        <Header />
        <div className="fixed -z-[1] h-[100vh] w-[100vw] overflow-hidden bg-gray-800">
          <Image
            src="/home-bg.webp"
            alt=""
            className="object-cover object-top opacity-0 transition-opacity duration-500"
            sizes="100vw"
            fill
            priority={true}
            onLoad={(event) => {
              const image = event.target;

              if (image instanceof HTMLElement) {
                image.classList.remove("opacity-0");
              }
            }}
          />
        </div>
        <div className="fixed top-1/4 w-full text-center text-white drop-shadow-lg">
          <h1 className="mb-6 text-6xl ">Boardgaems</h1>
          <p className="text-lg">Gotta collect &apos;em all.</p>
        </div>
      </div>
    </main>
  );
}
