import { useEffect, useState } from "react";

export const getSprintResults = <T>() => {
  const [sprintResults, setSprintResults] = useState([]);

  useEffect(() => {
    async function fetchRaceResults() {
      const roundNumbers = [4, 10, 13, 18, 19, 21];
      const sprintResultsByRound = await Promise.all(
        roundNumbers.map(async (round) => {
          const response = await fetch(
            `https://ergast.com/api/f1/current/${round}/sprint.json`
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
      setSprintResults(sprintResultsByRound as any);
    }
    fetchRaceResults();
  }, []);
  return sprintResults;
};
