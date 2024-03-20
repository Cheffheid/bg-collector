"use client";

import { type ChangeEvent, useState } from "react";
import { Header } from "~/app/_components/header";

interface ScoreType {
  forests: number;
  city: number;
  factories: number;
  lakes: number;
}

export default function Honshu() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-6xl xl:px-0">
      <div className="flex h-screen flex-col justify-start">
        <Header />
        <div className="container mx-auto flex flex-col items-center divide-y divide-gray-200 dark:divide-gray-700">
          <div className="mb-4 text-center">
            <h1 className="w-full text-2xl font-bold">Honshu</h1>
            <p>
              Scoring in Honshu is relatively straightforward, and works like
              this:
            </p>
            <ul className="list-disc text-left">
              <li>For each forest square the players score 1 point.</li>
              <li>
                For each town square the players score 1 point, but only the
                biggest town district of each player is counted. A district
                consists of all orthogonally adjacent squares of the same area
                type.
              </li>
              <li>
                For each factory which can be given a resource from a matching
                production square the players score 2/3/4 points.
              </li>
              <li>
                The first lake square of each lake district is worth 0 and each
                consecutive square is worth 3 points.
              </li>
            </ul>
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
    factories: 0,
    lakes: 0,
  });
  const [points, setPoints] = useState(0);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if ("" === value) {
      return;
    }

    const newScoreValues = { ...formValues, [name]: parseInt(value) };

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
    if (scoringValues.factories > 0) {
      factoryScore = scoringValues.factories * 2;
    }

    // Each lake district square is worth 3 points beyond the first square.
    if (scoringValues.lakes > 0) {
      lakeScore = (scoringValues.lakes - 1) * 3;
    }

    return forestScore + cityScore + factoryScore + lakeScore;
  };

  return (
    <form>
      <div>
        <label>Forests</label>
        <input
          type="number"
          value={formValues.forests}
          name="forests"
          onChange={(e) => handleInputChange(e)}
        />
      </div>

      <div>
        <label>Largest City</label>
        <input
          type="number"
          value={formValues.city}
          name="city"
          onChange={(e) => handleInputChange(e)}
        />
      </div>

      <div>
        <label>Factories</label>
        <input
          type="number"
          value={formValues.factories}
          name="factories"
          onChange={(e) => handleInputChange(e)}
        />
      </div>

      <div>
        <label>Lakes</label>
        <input
          type="number"
          value={formValues.lakes}
          name="lakes"
          onChange={(e) => handleInputChange(e)}
        />
      </div>
      <p>Total: {points}</p>
    </form>
  );
}
