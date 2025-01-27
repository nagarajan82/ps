import { useEffect, useState } from "react";

export const getRecentRaceResults = <T>() => {
  const [recentRaceResults, setRecentRaceResults] = useState([]);

  useEffect(() => {
    async function fetchRecentRaceResults() {
      const raceName = [
        "bahrain",
        "jeddah",
        "albert_park",
        "baku",
        "miami",
        "imola",
        "monaco",
        "catalunya",
        "villeneuve",
        "red_bull_ring",
        "silverstone",
        "hungaroring",
        "spa",
        "zandvoort",
        "monza",
        "marina_bay",
        "suzuka",
        "losail",
        "americas",
        "rodriguez",
        "interlagos",
        "vegas",
        "yas_marina",
      ];
      const recentResultsByRace = await Promise.all(
        raceName.map(async (race) => {
          const response = await fetch(
            `https://ergast.com/api/f1/circuits/${race}/results/1.json?limit=100`
          );
          const data = await response.json();
          if (
            data.MRData.RaceTable.Races[
              data.MRData.RaceTable.Races.length - 1
            ] === undefined
          )
            return;
          return data.MRData.RaceTable.Races[
            data.MRData.RaceTable.Races.length - 1
          ];
        })
      );
      setRecentRaceResults(recentResultsByRace as any);
    }
    fetchRecentRaceResults();
  }, []);
  return recentRaceResults;
};
