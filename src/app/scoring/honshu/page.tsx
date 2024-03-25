"use client";

import { type ChangeEvent, useState } from "react";
import { Header } from "~/app/_components/header";
import { PageHeader } from "~/app/_components/pageHeader";

interface ScoreType {
  forests: number;
  city: number;
  factories: {
    twopoint: number;
    threepoint: number;
    fourpoint: number;
  };
  lakes: number[];
}

export default function Honshu() {
  return (
    <main>
      <div className="flex h-screen flex-col justify-start">
        <Header />
        <PageHeader
          pageTitle="Honshu"
          pageDescription="Scoring in Honshu is relatively straightforward, and works like
            this:"
        />
        <div className="container mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="flex max-w-7xl items-center divide-y divide-gray-200 xl:max-w-6xl dark:divide-gray-700">
            <HonshuPointCalculator />
          </div>
        </div>
      </div>
    </main>
  );
}

function HonshuPointCalculator() {
  const [formValues, setFormValues] = useState({
    forests: 0,
    city: 0,
    factories: {
      twopoint: 0,
      threepoint: 0,
      fourpoint: 0,
    },
    lakes: [0],
  });
  const [points, setPoints] = useState(0);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, dataset } = event.target;
    let newScoreValues;

    if ("" === value) {
      return;
    }

    if (name.includes("factories")) {
      const factoryType = name.substring(
        name.indexOf("[") + 1,
        name.lastIndexOf("]"),
      );

      newScoreValues = {
        ...formValues,
        factories: {
          ...formValues.factories,
          [factoryType]: parseInt(value),
        },
      };
    } else if (name.includes("lakes")) {
      newScoreValues = { ...formValues };

      newScoreValues.lakes[parseInt(dataset.lake!)] = parseInt(value);
    } else {
      newScoreValues = { ...formValues, [name]: parseInt(value) };
    }

    setFormValues(newScoreValues);
    setPoints(calculatePoints(newScoreValues));
  };

  const calculatePoints = (scoringValues: ScoreType) => {
    let forestScore = 0;
    let cityScore = 0;
    let factoryScore = 0;
    let lakeScore = 0;

    // Forests are worth 2 points for each square.
    if (scoringValues.forests > 0) {
      forestScore = scoringValues.forests * 2;
    }

    // For the biggest city, each square is worth 1 point.
    if (scoringValues.city > 0) {
      cityScore = scoringValues.city;
    }

    // Factories are worth 2, 3 or 4 points.
    if (scoringValues.factories.twopoint > 0) {
      factoryScore += scoringValues.factories.twopoint * 2;
    }

    if (scoringValues.factories.threepoint > 0) {
      factoryScore += scoringValues.factories.threepoint * 3;
    }

    if (scoringValues.factories.fourpoint > 0) {
      factoryScore += scoringValues.factories.fourpoint * 4;
    }

    // Each lake district square is worth 3 points beyond the first square.
    scoringValues.lakes.map((lake) => {
      if (0 === lake) {
        lakeScore += 0;
      } else {
        lakeScore += (lake - 1) * 3;
      }
    });

    return forestScore + cityScore + factoryScore + lakeScore;
  };

  function handleLakeButton() {
    formValues.lakes.push(0);

    setFormValues({ ...formValues });
  }

  return (
    <form>
      <div className="py-2">
        <label
          className="block font-semibold leading-6 text-gray-900"
          htmlFor="forests"
        >
          Forests
        </label>
        <p className="mt-2 text-sm">
          For each forest square the players score 1 point.
        </p>
        <input
          className="mt-2.5 p-1 text-sm"
          type="number"
          value={formValues.forests}
          name="forests"
          onChange={(e) => handleInputChange(e)}
        />
      </div>

      <div className="py-2">
        <label
          className="block font-semibold leading-6 text-gray-900"
          htmlFor="name"
        >
          Largest City
        </label>
        <p className="mt-2 text-sm">
          For each town square the players score 1 point, but only the biggest
          town district of each player is counted. A district consists of all
          orthogonally adjacent squares of the same area type.
        </p>
        <input
          className="mt-2.5 p-1 text-sm"
          type="number"
          value={formValues.city}
          name="city"
          onChange={(e) => handleInputChange(e)}
        />
      </div>

      <div className="py-2">
        <p className="block font-semibold leading-6 text-gray-900">Factories</p>
        <p className="mt-2 text-sm">
          For each factory which can be given a resource from a matching
          production square the players score 2/3/4 points.
        </p>
        <div className="mt-2 flex gap-4">
          <div>
            <label
              className="block text-sm font-semibold leading-6 text-gray-900"
              htmlFor="factories[twopoint]"
            >
              2 Point Factories
            </label>
            <input
              className="mt-2.5 p-1 text-sm"
              type="number"
              value={formValues.factories.twopoint}
              name="factories[twopoint]"
              onChange={(e) => handleInputChange(e)}
            />
          </div>
          <div>
            <label
              className="block text-sm font-semibold leading-6 text-gray-900"
              htmlFor="factories[threepoint]"
            >
              3 Point Factories
            </label>
            <input
              className="mt-2.5 p-1 text-sm"
              type="number"
              value={formValues.factories.threepoint}
              name="factories[threepoint]"
              onChange={(e) => handleInputChange(e)}
            />
          </div>
          <div>
            <label
              className="block text-sm font-semibold leading-6 text-gray-900"
              htmlFor="factories[fourpoint]"
            >
              4 Point Factories
            </label>
            <input
              className="mt-2.5 p-1 text-sm"
              type="number"
              value={formValues.factories.fourpoint}
              name="factories[fourpoint]"
              onChange={(e) => handleInputChange(e)}
            />
          </div>
        </div>
      </div>

      <div className="py-2">
        <label
          className="block font-semibold leading-6 text-gray-900"
          htmlFor="lakes[]"
        >
          Lakes
        </label>
        <p className="mt-2 text-sm">
          The first lake square of each lake district is worth 0 and each
          consecutive square is worth 3 points.
        </p>
        <div className="flex flex-col items-start">
          {formValues.lakes.map((lake: number, index: number) => {
            return (
              <input
                key={index}
                data-lake={index}
                className="mt-2.5 p-1 text-sm"
                type="number"
                value={lake}
                name="lakes[]"
                onChange={(e) => handleInputChange(e)}
              />
            );
          })}
        </div>
      </div>
      <button
        type="button"
        className="rounded-md border-gray-200 bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500 focus:bg-blue-500 disabled:bg-slate-400"
        onClick={() => handleLakeButton()}
        disabled={4 < formValues.lakes.length}
      >
        Add a Lake
      </button>
      <p className="mt-4 text-xl font-semibold">Total points: {points}</p>
    </form>
  );
}
