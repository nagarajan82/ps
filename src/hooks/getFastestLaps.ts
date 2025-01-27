import { useEffect, useState } from "react";

export const getFastestLaps = <T>() => {
  const [fastestLaps, setFastestLaps] = useState([]);

  useEffect(() => {
    async function fetchFastestLaps() {
      const roundNumbers = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23,
      ];
      const fastestLapsByRound = await Promise.all(
        roundNumbers.map(async (round) => {
          const response = await fetch(
            `https://ergast.com/api/f1/current/${round}/fastest/1/results.json`
          );
          const data = await response.json();
          if (data.MRData.RaceTable.Races[0] === undefined) return;
          return {
            round,
            fastestLaps: data.MRData.RaceTable.Races[0].Results,
          };
        })
      );
      // console.log(fastestLapsByRound);
      setFastestLaps(fastestLapsByRound as any);
    }
    fetchFastestLaps();
  }, []);

  return fastestLaps;
};
