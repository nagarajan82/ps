import constructorInfo from "../../data/constructors.json";
import { useState } from "react";
import { CurrentConstructorRaceStandingsWidget } from "../../widgets/CurrentSeason/CurrentConstructorRaceStandingsWidget";
import { CurrentConstructorStandings } from "./CurrentConstructorStandings";
import { SpecificConstructorStandingsWidget } from "../../widgets/CurrentSeason/SpecificConstructorStandingsWidget";

type raceResultsProp = {
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

type ResultsProps = {
  raceResults: raceResultsProp[];
  // sprintResults: sprintResultsProp[];
  qualiStandings: QualiResults[];
  screenWidth: number;
  activeTeam: string;
};

export function ConstructorStandings({
  raceResults,
  // sprintResults,
  qualiStandings,
  screenWidth,
  activeTeam,
}: ResultsProps) {
  const [activeSpecificTeam, setActiveSpecificTeam] = useState(
    constructorInfo[0].name
  );
  //don't think this is properly config'd for sprint races, check after Baku
  const constructorArray = constructorInfo.map((cons) => {
    const constructorId = cons.urlId ?? cons.constructorId; // use urlId if it exists, otherwise use constructorId
    const constructorResults = raceResults.filter((race) =>
      race?.Results.some(
        (result) => result.Constructor.constructorId === constructorId
      )
    );

    const results = constructorResults.map((result) => {
      const raceResultsForConstructor = result.Results.filter(
        (r) => r.Constructor.constructorId === constructorId
      );
      const totalPointsForConstructor = raceResultsForConstructor.reduce(
        (accumulator, result) => {
          return accumulator + parseInt(result.points as string);
        },
        0
      );
      return {
        round: result.round,
        points: totalPointsForConstructor,
        raceName: result.raceName,
        country: result.Circuit.Location.country,
      };
    });

    return {
      constructorId,
      constructorName: cons.name,
      results: results,
    };
  });

  const constructorsWithTotalPoints = constructorArray.map((constructor) => {
    const totalPoints = constructor.results.reduce((accumulator, result) => {
      return accumulator + result.points;
    }, 0);

    return {
      ...constructor,
      totalPoints,
    };
  });

  return (
    <div className="flex flex-wrap">
      <div
        style={{
          display: activeTeam === "constructorsOverview" ? "block" : "none",
        }}
      >
        <CurrentConstructorStandings screenWidth={screenWidth} />
      </div>
      <div
        style={{
          display: activeTeam === "constructorRaces" ? "block" : "none",
        }}
      >
        <CurrentConstructorRaceStandingsWidget
          // sprintResults={sprintResults as any}
          raceResults={raceResults as any}
          screenWidth={screenWidth}
        />
      </div>
      <div
        className="my-3 w-full"
        style={{
          display: activeTeam === "specificConstructor" ? "block" : "none",
        }}
      >
        <label htmlFor="standings-driver--widget-select"></label>
        <select
          id="standings-driver--widget-select"
          value={activeSpecificTeam}
          onChange={(event) => setActiveSpecificTeam(event.target.value)}
          className="p-2 standings--widget-select rounded-lg w-full"
        >
          {constructorInfo.map((team) => (
            <option key={team.id} value={team.name}>
              {team.name}
            </option>
          ))}
        </select>
        <SpecificConstructorStandingsWidget
          // sprintResults={sprintResults as any}
          constructorResults={constructorsWithTotalPoints as any}
          screenWidth={screenWidth}
          activeSpecificTeam={activeSpecificTeam}
          key={activeTeam} // Add key prop to force re-render
        />
      </div>
    </div>
  );
}
