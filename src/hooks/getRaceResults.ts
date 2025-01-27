import { useEffect, useState } from "react";

export const getRaceResults = <T>() => {
  const [raceResults, setRaceResults] = useState([]);

  useEffect(() => {
    async function fetchRaceResults() {
      const roundNumbers = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23,
      ];
      const raceResultsByRound = await Promise.all(
        roundNumbers.map(async (round) => {
          const response = await fetch(
            `https://ergast.com/api/f1/current/${round}/results.json`
          );
          const data = await response.json();
          if (data.MRData.RaceTable.Races[0] === undefined) return;
          // return {
          //   round,
          //   raceResults: data.MRData.RaceTable.Races[0],
          // };
          return data.MRData.RaceTable.Races[0];
        })
      );
      setRaceResults(raceResultsByRound as any);
    }
    fetchRaceResults();
  }, []);

  return raceResults;
};
