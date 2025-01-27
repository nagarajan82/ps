import { parseISO } from "date-fns";
import trackInfo from "../../data/trackInfo.json";
import driverOfTheDay from "../../data/driverOfTheDay.json";
import fastestLap from "../../data/fastestLap.json";
import React, { useEffect, useState } from "react";
import { RaceResultsQualifyingWidget } from "../../widgets/CurrentSeason/RaceResultsQualifyingWidget";
import { RaceResultsFastestLapsWidget } from "../../widgets/CurrentSeason/RaceResultsFastestLapsWidget";
import { RaceResultsStartingGridWidget } from "../../widgets/CurrentSeason/RaceResultsStartingGridWidget";
import { RaceResultsDriverWidget } from "../../widgets/CurrentSeason/RaceResultsDriverWidget";
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
  activeRace: string;
  raceSchedule: RaceSchedule[];
};

export function RaceStandings({
  raceResults,
  qualiStandings,
  sprintResults,
  screenWidth,
  raceSchedule,
  activeRace,
}: ResultsProps) {
  const [raceTrackInfo, setRaceTrackInfo] = useState<RaceSchedule>();
  const [activeData, setActiveData] = useState("result");
  const [selectedQuali, setSelectedQuali] = useState<QualiResults | null>(null);
  const [selectedRace, setSelectedRace] = useState<UpdatedRacesResults | null>(
    raceResults[0]
  );

  useEffect(() => {
    const race = raceResults.find(
      (race) => race?.Circuit.circuitId === activeRace
    );
    const quali = qualiStandings.find(
      (object) => object.Circuit.circuitId === activeRace
    );
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
      (race) => race?.Circuit.circuitId === activeRace
    );
    setRaceTrackInfo(raceChoice as any);
    setSelectedRace(race as UpdatedRacesResults);
    setSelectedQuali(quali as QualiResults);
  }, [raceResults, activeRace, qualiStandings]);

  if (!raceTrackInfo) return null;

  const raceDateFuture = parseISO(
    raceTrackInfo.date + "T" + raceTrackInfo.time
  );

  if (!selectedRace || !selectedQuali) {
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
    <div
      className={`
              ${screenWidth <= 768 ? "flex flex-col" : "flex gap-10 m-10"}`}
    >
      <div className="my-3 w-96">
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
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-lg">Results Overview</h2>
          <div className="">
            <h3>Race Podium Positions</h3>
            <div className="flex">
              <p className="mx-1 w-4">1.</p>
              <p className="font-bold w-12">{top3[0].Driver.code}</p>
              <p className="w-28">{top3[0].Time.time}</p>
            </div>
            <div className="flex">
              <p className="mx-1 w-4">2.</p>
              <p className="font-bold w-12">{top3[1].Driver.code}</p>
              <p className="w-28">{top3[1].Time.time}</p>
            </div>
            <div className="flex">
              <p className="mx-1 w-4">3.</p>
              <p className="font-bold w-12">{top3[2].Driver.code}</p>
              <p className="w-28">{top3[2].Time.time}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex">
              <p className="w-40">Pole:</p>
              <p className="font-bold w-12">
                {selectedQuali.QualifyingResults[0].Driver.code}
              </p>
              <p className="w-20">{selectedQuali.QualifyingResults[0].Q3}s</p>
            </div>
            <div className="flex">
              <p className="w-40">Driver of the Day:</p>
              <p className="font-bold">{driverAward?.driverName}</p>
            </div>
            <div className="flex">
              <p className="w-40">Fastest Lap Award:</p>
              <p className="font-bold">{fastestLapAward?.driverName}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        className={` 
              ${screenWidth <= 768 ? "" : ""}`}
      >
        <div
          className={`mb-3
              ${screenWidth <= 768 ? "w-full" : "w-96"}`}
        >
          <label htmlFor="results--widget-select"></label>
          <select
            id="results--widget-select"
            value={activeData}
            onChange={(event) => setActiveData(event.target.value)}
            className="p-2 standings--widget-select rounded-lg w-full"
          >
            <option value="result">Race Result</option>
            <option value="fastest">Fastest Laps</option>
            <option value="pit">Pit Stop Summary</option>
            <option value="grid">Starting Grid</option>
            <option value="qualifying">Qualifying</option>
            <option value="p1">Practice 1</option>
            <option value="p2">Practice 2</option>
            <option value="p3">Practice 3</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-6">
          <div className={activeData === "result" ? "block" : "hidden"}>
            <RaceResultsDriverWidget
              raceResult={selectedRace}
              screenWidth={screenWidth}
              key={selectedRace.round} // Add key prop to force re-render
            />
          </div>
          <div className={activeData === "grid" ? "block" : "hidden"}>
            <RaceResultsStartingGridWidget
              raceResult={selectedRace}
              qualiResult={selectedQuali}
              screenWidth={screenWidth}
              key={selectedRace.round} // Add key prop to force re-render
            />
          </div>
          <div className={activeData === "fastest" ? "block" : "hidden"}>
            <RaceResultsFastestLapsWidget
              raceResult={selectedRace}
              screenWidth={screenWidth}
              key={selectedRace.round} // Add key prop to force re-render
            />
          </div>
          <div className={activeData === "qualifying" ? "block" : "hidden"}>
            <RaceResultsQualifyingWidget
              qualiResult={selectedQuali}
              screenWidth={screenWidth}
              key={selectedRace.round} // Add key prop to force re-render
            />
          </div>
        </div>
      </div>
    </div>
  );
}
