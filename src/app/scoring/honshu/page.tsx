"use client";

import { type ChangeEvent, useState } from "react";
import { number } from "zod";
import { Header } from "~/app/_components/header";

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
        <div className="container mx-auto flex max-w-3xl flex-col items-center divide-y divide-gray-200 px-4 sm:px-6 xl:max-w-6xl xl:px-0 dark:divide-gray-700">
          <div className="mb-4 text-center">
            <h1 className="w-full text-2xl font-bold">Honshu</h1>
            <p>
              Scoring in Honshu is relatively straightforward, and works like
              this:
            </p>
          </div>
          <HonshuPointCalculator />
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
      <div className="p-2">
        <p className="mb-4">
          For each forest square the players score 1 point.
        </p>
        <div>
          <label>Forests</label>
          <input
            className="ml-2 p-1"
            type="number"
            value={formValues.forests}
            name="forests"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
      </div>

      <div className="p-2">
        <p className="mb-4">
          For each town square the players score 1 point, but only the biggest
          town district of each player is counted. A district consists of all
          orthogonally adjacent squares of the same area type.
        </p>
        <div>
          <label>Largest City</label>
          <input
            className="ml-2 p-1"
            type="number"
            value={formValues.city}
            name="city"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
      </div>

      <div className="p-2">
        <p className="mb-4">
          For each factory which can be given a resource from a matching
          production square the players score 2/3/4 points.
        </p>
        <div className="flex">
          <label className="block w-1/3">
            2 Point Factories
            <br />
            <input
              className="p-1"
              type="number"
              value={formValues.factories.twopoint}
              name="factories[twopoint]"
              onChange={(e) => handleInputChange(e)}
            />
          </label>
          <label className="block w-1/3">
            3 Point Factories
            <br />
            <input
              className="p-1"
              type="number"
              value={formValues.factories.threepoint}
              name="factories[threepoint]"
              onChange={(e) => handleInputChange(e)}
            />
          </label>
          <label className="block w-1/3">
            4 Point Factories
            <br />
            <input
              className="p-1"
              type="number"
              value={formValues.factories.fourpoint}
              name="factories[fourpoint]"
              onChange={(e) => handleInputChange(e)}
            />
          </label>
        </div>
      </div>

      <div className="p-2">
        <p className="mb-4">
          The first lake square of each lake district is worth 0 and each
          consecutive square is worth 3 points.
        </p>
        <div>
          <label>Lakes</label>
          {formValues.lakes.map((lake: number, index: number) => {
            return (
              <input
                key={index}
                data-lake={index}
                className="ml-2 p-1"
                type="number"
                value={lake}
                name="lakes[]"
                onChange={(e) => handleInputChange(e)}
              />
            );
          })}
        </div>
        <button type="button" onClick={() => handleLakeButton()}>
          Add a Lake
        </button>
      </div>
      <p className="text-center text-xl">Total points: {points}</p>
    </form>
  );
}
