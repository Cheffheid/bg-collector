"use client";

import { api } from "~/trpc/react";
import Image from "next/image";

import { Header } from "~/app/_components/header";
import { PageHeader } from "~/app/_components/pageHeader";

export default function Page({ params }: { params: { id: string } }) {
  const query = api.bgggamedata.getGameByID.useQuery({
    id: parseInt(params.id, 10),
  });
  const parser = new DOMParser();
  const boardgame = {
    name: "",
    image: "",
  };

  if ("success" === query.status) {
    const boardgamexml = parser.parseFromString(query.data, "text/xml");
    const errorNode = boardgamexml.querySelector("error");

    if (errorNode) {
      return (
        <div>
          <p>No game with that ID</p>
        </div>
      );
    }

    const nameNode = boardgamexml.querySelector('name[primary="true"]');
    const imageNode = boardgamexml.querySelector("image");

    if (nameNode) {
      boardgame.name = nameNode.innerHTML;
    }

    if (imageNode) {
      boardgame.image = imageNode.innerHTML;
    }
  }

  return (
    <main>
      <div className="flex h-screen flex-col justify-start">
        <Header />
        <PageHeader pageTitle={boardgame?.name} pageDescription="" />
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex max-w-7xl flex-col items-center divide-y divide-gray-200 px-4 py-6 lg:px-8 xl:max-w-6xl xl:px-0 dark:divide-gray-700">
            <div>
              {boardgame.image && (
                <Image src={boardgame.image} width="500" height="500" alt="" />
              )}
              <p>My Gaem: {boardgame?.name ? `${boardgame?.name}` : ""}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
