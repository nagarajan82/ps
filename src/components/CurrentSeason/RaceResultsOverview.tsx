import { parseISO } from "date-fns";
import trackInfo from "../../data/trackInfo.json";
import driverOfTheDay from "../../data/driverOfTheDay.json";
import fastestLap from "../../data/fastestLap.json";
import React, { useEffect, useState } from "react";

type UpdatedRacesResults = {
  season: string;
  round: string;
  url: string;
  raceName: string;
  circuitId: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  date: string;
  time: string;
  localRaceDateTime: string;
  Results: [
    {
      number: string;
      position: string;
      positionText: string;
      points: string;
      Driver: {
        driverId: string;
        permanentNumber: string;
        code: string;
        url: string;
        givenName: string;
        familyName: string;
        dateOfBirth: string;
        nationality: string;
      };
      Constructor: {
        constructorId: string;
        url: string;
        name: string;
        nationality: string;
      };
      grid: string;
      laps: string;
      status: string;
      Time: {
        millis: string;
        time: string;
      };
      FastestLap: {
        rank: string;
        lap: string;
        Time: {
          time: string;
        };
        AverageSpeed: {
          units: string;
          speed: string;
        };
      };
    }
  ];
  additionalInfo: {
    circuitId: string;
    imgUrl: string;
    heroImgUrl: string;
    flagUrl: string;
    url: string;
    circuitUrl: string;
    circuitName: string;
    laps: string;
    circuitLength: string;
    raceLength: string;
    firstGrandPrix: string;
    lapRecord: {
      time: string;
      driver: string;
      year: string;
    };
    qualiRecord: {
      time: string;
      driver: string;
      year: string;
    };
    numberOfTimesHeld: string;
    mostDriverWins: string;
    mostConstructorWins: string;
    trackType: string;
    trackComments: string;
    grandPrixComments: {
      1: string;
      2: string;
      3: string;
    };
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
      timezone: string;
      gmtOffset: string;
    };
  };
};
type sprintResultsProp = {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  date: string;
  time: string;
  SprintResults: [
    {
      number: string;
      position: string;
      positionText: string;
      points: string;
      Driver: {
        driverId: string;
        permanentNumber: string;
        code: string;
        url: string;
        givenName: string;
        familyName: string;
        dateOfBirth: string;
        nationality: string;
      };
      Constructor: {
        constructorId: string;
        url: string;
        name: string;
        nationality: string;
      };
      grid: string;
      laps: string;
      status: string;
      Time: {
        millis: string;
        time: string;
      };
      FastestLap: {
        rank: string;
        lap: string;
        Time: {
          time: string;
        };
        AverageSpeed: {
          units: string;
          speed: string;
        };
      };
    }
  ];
};
type QualiResults = {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  date: string;
  time: string;
  QualifyingResults: [
    {
      number: string;
      position: string;
      Driver: {
        driverId: string;
        code: string;
        url: string;
        givenName: string;
        familyName: string;
        dateOfBirth: string;
        nationality: string;
      };
      Constructor: {
        constructorId: string;
        url: string;
        name: string;
        nationality: string;
      };
      Q1: string;
      Q2: string;
      Q3: string;
    }
  ];
};

type RaceSchedule = {
  season: number;
  round: number;
  url: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: number;
      long: number;
      locality: string;
      country: string;
    };
  };
  date: string;
  time: string;
  // localRaceDateTime: string;
  FirstPractice: {
    date: string;
    time: string;
  };
  SecondPractice: {
    date: string;
    time: string;
  };
  ThirdPractice: {
    date: string;
    time: string;
  };
  Qualifying: {
    date: string;
    time: string;
  };
  Sprint: {
    date: string;
    time: string;
  };
  additionalInfo: {
    circuitId: string;
    imgUrl: string;
    heroImgUrl: string;
    flagUrl: string;
    url: string;
    circuitUrl: string;
    circuitName: string;
    laps: string;
    circuitLength: string;
    raceLength: string;
    firstGrandPrix: string;
    lapRecord: {
      time: string;
      driver: string;
      year: string;
    };
    qualiRecord: {
      time: string;
      driver: string;
      year: string;
    };
    numberOfTimesHeld: string;
    mostDriverWins: string;
    mostConstructorWins: string;
    trackType: string;
    trackComments: string;
    grandPrixComments: {
      1: string;
      2: string;
      3: string;
    };
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
      timezone: string;
      gmtOffset: string;
    };
  };
};

type ResultsProps = {
  raceResults: UpdatedRacesResults[];
  qualiStandings: QualiResults[];
  sprintResults: sprintResultsProp[];
  screenWidth: number;
  raceSchedule: RaceSchedule[];
};

export function RaceResultsOverview({
  raceResults,
  qualiStandings,
  sprintResults,
  screenWidth,
  raceSchedule,
}: ResultsProps) {
  const [raceTrackInfo, setRaceTrackInfo] = useState<RaceSchedule>();
  const [selectedQuali, setSelectedQuali] = useState<QualiResults | null>(
    qualiStandings[qualiStandings.length - 1]
  );
  const [selectedRace, setSelectedRace] = useState<UpdatedRacesResults | null>(
    raceResults[raceResults.length - 1]
  );

  useEffect(() => {
    const race = raceResults[raceResults.length - 1];
    const quali = qualiStandings[qualiStandings.length - 1];
    const truncatedRaceSchedule = raceSchedule.map((value: any) => {
      return {
        ...value,
        circuitId: value.Circuit.circuitId,
      };
    });
    const updatedRaceSchedule = truncatedRaceSchedule.map((value) => {
      const additionalInfo = trackInfo.find(
        (race) => race.circuitId === value.Circuit.circuitId
      );

      return {
        ...value,
        additionalInfo,
      };
    });
    const raceChoice = updatedRaceSchedule.find(
      (race) =>
        race?.Circuit.circuitId ===
        raceResults[raceResults.length - 1].circuitId
    );

    setRaceTrackInfo(raceChoice as any);
    setSelectedRace(race as UpdatedRacesResults);
    setSelectedQuali(quali as QualiResults);
  }, [raceResults, qualiStandings]);

  if (!raceTrackInfo) {
    return null;
  }

  const raceDateFuture = parseISO(
    raceTrackInfo.date + "T" + raceTrackInfo.time
  );

  if (!selectedRace || !selectedQuali) {
    console.log("here2");

    return (
      <div>
        <div className="m-2 flex flex-col">
          <div className="flex justify-between">
            <p className="text-xs">Round {raceTrackInfo.round}</p>
            <p className="text-xs">
              {new Date(raceDateFuture).toLocaleString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-sm">
                {raceTrackInfo.Circuit?.Location?.locality},{" "}
                {raceTrackInfo.Circuit?.Location?.country}
              </p>
              <p className="font-bold">{raceTrackInfo.Circuit?.circuitName}</p>
            </div>
            <img
              className="rounded-sm w-16 border-2 border-gray-200"
              src={raceTrackInfo.additionalInfo.flagUrl}
              alt={raceTrackInfo.Circuit.circuitName}
            />
          </div>
        </div>
        <p className="m-2 text-sm">
          No results yet! Check back after the race has occured.
        </p>
      </div>
    );
    // no next race found
  }

  const raceDate = parseISO(selectedRace.date + "T" + selectedRace.time);
  const sortedRaceResults = selectedRace?.Results.sort(
    (a, b) => parseInt(a.position) - parseInt(b.position)
  );
  const top3 = sortedRaceResults.slice(0, 3);

  const driverAward = driverOfTheDay.find(
    (race) => race?.circuitId === selectedRace.circuitId
  );

  const fastestLapAward = fastestLap.find(
    (race) => race?.circuitId === selectedRace.circuitId
  );

  return (
    <div className="m-2 max-w-xl">
      <h2>Previous Grand Prix Results</h2>

      <div className="flex flex-col">
        <div className="flex justify-between">
          <p className="text-xs">Round {selectedRace.round}</p>
          <p className="text-xs">
            {new Date(raceDate).toLocaleString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-sm">
              {selectedRace.Circuit?.Location?.locality},{" "}
              {selectedRace.Circuit?.Location?.country}
            </p>
            <p className="font-bold">{selectedRace.Circuit?.circuitName}</p>
          </div>
          <img
            className="rounded-sm w-16 border-2 border-gray-200"
            src={selectedRace.additionalInfo.flagUrl}
            alt={selectedRace.Circuit.circuitName}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div>
            <h3>Top 3</h3>
            <p>
              1. {top3[0].Driver.code}
              {top3[0].Time.time}
            </p>
            <p>
              2. {top3[1].Driver.code}
              {top3[1].Time.time}
            </p>
            <p>
              3. {top3[2].Driver.code}
              {top3[2].Time.time}
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <div>
            <p>
              Pole:
              <span className="font-bold">
                {selectedQuali.QualifyingResults[0].Driver.code}
              </span>
              <span>{selectedQuali.QualifyingResults[0].Q3}</span>
            </p>
          </div>
          <div>
            <p>
              Driver of the Day:
              <span className="font-bold">{driverAward?.driverName}</span>
            </p>
          </div>
          <div>
            <p>
              Fastest Lap Award:
              <span className="font-bold">{fastestLapAward?.driverName}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
