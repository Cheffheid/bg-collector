"use client";

import Image from "next/image";
import { Header } from "./_components/header";
import homepageBg from "src/styles/home-bg.webp";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";

export default function Home() {
  return (
    <main>
      <div className="flex h-screen flex-col justify-start">
        <Header />
        <div className="fixed -z-[1] h-[100vh] w-[100vw] overflow-hidden">
          <Image
            src={homepageBg}
            alt=""
            className="scale-125 object-cover object-top blur transition-all"
            placeholder="empty"
            sizes="100vw"
            fill
            onLoad={(event) => {
              const image = event.target;

              if (image instanceof HTMLElement) {
                image.classList.remove("blur", "scale-125");
              }
            }}
          />
        </div>
        <div className="fixed top-1/4 w-full">
          <h1 className="text-shadow mb-6 text-center text-6xl text-white">
            Boardgaems
          </h1>
          <p className="text-shadow text text-center text-white">
            Gotta collect &apos;em all.
          </p>
        </div>
      </div>
    </main>
  );
}
