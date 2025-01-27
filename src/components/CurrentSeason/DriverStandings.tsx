import { CurrentDriverRaceStandingsWidget } from "../../widgets/CurrentSeason/CurrentDriverRaceStandingsWidget";
import { CurrentDriverSprintStandingsWidget } from "../../widgets/CurrentSeason/CurrentDriverSprintStandingsWidget";
import { CurrentDriverStandings } from "./CurrentDriverStandings";
import driverInfo from "../../data/driver.json";
import { useState } from "react";
import { SpecificDriverStandingsWidget } from "../../widgets/CurrentSeason/SpecificDriverStandingsWidget";

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
  sprintResults: sprintResultsProp[];
  qualiStandings: QualiResults[];
  screenWidth: number;
  activeDriver: string;
  raceSchedule: RaceSchedule[];
};

export function DriverStandings({
  raceResults,
  sprintResults,
  raceSchedule,
  qualiStandings,
  screenWidth,
  activeDriver,
}: ResultsProps) {
  const [activeSpecificDriver, setActiveSpecificDriver] = useState(
    driverInfo[0].code
  );

  return (
    <div className="flex flex-wrap">
      <div style={{ display: activeDriver === "overview" ? "block" : "none" }}>
        <CurrentDriverStandings screenWidth={screenWidth} />
      </div>
      <div
        style={{
          display: activeDriver === "driverRaces" ? "block" : "none",
        }}
      >
        <CurrentDriverRaceStandingsWidget
          sprintResults={sprintResults as any}
          raceResults={raceResults as any}
          screenWidth={screenWidth}
        />
      </div>
      <div
        style={{
          display: activeDriver === "driverSprints" ? "block" : "none",
        }}
      >
        <CurrentDriverSprintStandingsWidget
          sprintResults={sprintResults as any}
          screenWidth={screenWidth}
        />
      </div>
      <div
        className="my-3 w-full"
        style={{
          display: activeDriver === "specificDriver" ? "block" : "none",
        }}
      >
        <label htmlFor="standings-driver--widget-select"></label>
        <select
          id="standings-driver--widget-select"
          value={activeSpecificDriver}
          onChange={(event) => setActiveSpecificDriver(event.target.value)}
          className="p-2 standings--widget-select rounded-lg w-full"
        >
          {driverInfo.map((driver) => (
            <option key={driver.id} value={driver.code}>
              {driver.name}
            </option>
          ))}
        </select>
        <SpecificDriverStandingsWidget
          sprintResults={sprintResults as any}
          raceResults={raceResults as any}
          screenWidth={screenWidth}
          activeSpecificDriver={activeSpecificDriver}
          raceSchedule={raceSchedule as any}
          qualiStandings={qualiStandings as any}
        />
      </div>
    </div>
  );
}
