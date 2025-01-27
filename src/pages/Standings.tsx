import { useEffect, useState } from "react";
import { getRaceResults } from "../hooks/getRaceResults";
import { getSprintResults } from "../hooks/getSprintResults";
import { RaceStandings } from "../components/CurrentSeason/RaceStandings";
import trackInfo from "../data/trackInfo.json";
import { getRaceSchedule } from "../hooks/getRaceSchedule";
import { getQualiResults } from "../hooks/getQualiResults";
import { DriverStandings } from "../components/CurrentSeason/DriverStandings";
import { ConstructorStandings } from "../components/CurrentSeason/ConstructorStandings";
import { DHLFastestLapStandings } from "../widgets/CurrentSeason/DHLFastestLapStandings";
import { DriverOfTheDayAwardStandings } from "../widgets/CurrentSeason/DriverOfTheDayAwardStandings";

type ScreenWidthProps = {
  screenWidth: number;
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

export function Standings({ screenWidth }: ScreenWidthProps) {
  // const [activeWidget, setActiveWidget] = useState("drivers");

  const [loading, raceSchedule] = getRaceSchedule<RaceSchedule[]>({
    method: "get",
    url: "https://ergast.com/api/f1/current.json",
  });
  const [qualiLoading, qualiStandings] = getQualiResults<QualiResults[]>({
    method: "get",
    url: "https://ergast.com/api/f1/current/qualifying.json?limit=500",
  });

  const raceResults = getRaceResults();
  const sprintResults = getSprintResults();

  const [activeDriver, setActiveDriver] = useState("overview");
  const [activeTeam, setActiveTeam] = useState("constructorsOverview");
  const [activeRace, setActiveRace] = useState("bahrain");
  const [activePage, setActivePage] = useState("drivers");

  if (!raceResults || !sprintResults || loading || qualiLoading) {
    return (
      <div className="ml-8 mt-6">
        <p>Loading...</p>
      </div>
    );
  }
  if (!raceSchedule) {
    return (
      <div className="ml-8 mt-6">
        <p>Loading...</p>
      </div>
    );
  }

  function getLocalTime(date: string, time: string, offset: number) {
    // need to add the mins, etc back on
    const mainHour = Number(time.split(":")[0]);
    let result = mainHour + offset;
    const timeArr = time.split(":");
    if (result < 0) {
      result = 24 + result;
      const updatedTime =
        result + ":" + time.split(":")[1] + ":" + time.split(":")[2];
      const updatedDateDay = (date.slice(8) as any) - 1;
      const updatedDate = date.slice(0, 8) + updatedDateDay;
      return updatedDate + "T" + updatedTime;
    }
    const updatedTime =
      result + ":" + time.split(":")[1] + ":" + time.split(":")[2];

    return date + "T" + updatedTime;
  }

  const filteredRaceResults = raceResults.filter(
    (value) => value !== undefined
  );

  const truncatedRaceSchedule = filteredRaceResults.map((value: any) => {
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
      localRaceDateTime: getLocalTime(
        value.date,
        value.time,
        Number(additionalInfo?.Location.gmtOffset)
      ),
    };
  });

  return (
    <div
      className={
        screenWidth <= 450
          ? "current-season--container-mobile m-4"
          : "current-season--container"
      }
    >
      <div className="flex border-b-2 border-gray-400">
        <h1 className="text-xl w-full font-bold mb-1">Standings</h1>
      </div>
      
      <div className="my-3 w-full">
        <label htmlFor="results--widget-select"></label>
        <select
          id="results--widget-select"
          value={activePage}
          onChange={(event) => setActivePage(event.target.value)}
          className="p-2 standings--widget-select rounded-lg w-full"
        >
          <option value="drivers">Drivers</option>
          <option value="constructors">Constructors</option>
          <option value="dhlfl">DHL Fastest Lap Award</option>
          <option value="dotd">Driver of the Day Award</option>
        </select>
      </div>
      <div
        className="my-3 w-full"
        style={{ display: activePage === "drivers"  ? "block" : "none" }}
      >
        <label htmlFor="standings-driver--widget-select"></label>
        <select
          id="standings-driver--widget-select"
          value={activeDriver}
          onChange={(event) => setActiveDriver(event.target.value)}
          className="p-2 standings--widget-select rounded-lg w-full"
        >
          <option value="overview">Driver Overview</option>
          <option value="driverRaces">Driver (by race)</option>
          <option value="driverSprints">Driver (by sprint)</option>
          <option value="specificDriver">Specific Driver</option>
        </select>
        <DriverStandings
          sprintResults={sprintResults as any}
          raceResults={raceResults as any}
          screenWidth={screenWidth}
          activeDriver={activeDriver}
          raceSchedule={raceSchedule as any}
          qualiStandings={qualiStandings as any}
        />
      </div>
      <div
        className="my-3 w-full"
        style={{ display: activePage === "constructors" ? "block" : "none" }}
      >
        <label htmlFor="standings--widget-select"></label>
        <select
          id="standings--widget-select"
          value={activeTeam}
          onChange={(event) => setActiveTeam(event.target.value)}
          className="p-2 standings--widget-select rounded-lg w-full"
        >
          <option value="constructorsOverview">Constructor Overview</option>
          <option value="constructorRaces">Constructor (by race)</option>
          <option value="specificConstructor">Specific Constructor</option>
        </select>
        <ConstructorStandings
          // sprintResults={sprintResults as any}
          raceResults={updatedRaceSchedule as any}
          screenWidth={screenWidth}
          activeTeam={activeTeam}
          qualiStandings={qualiStandings as any}
        />
      </div>
      <div
        className="my-3 w-full"
        style={{ display: activePage === "dhlfl" ? "block" : "none" }}
      >
        <DHLFastestLapStandings screenWidth={screenWidth} />
      </div>
      <div
        className="my-3 w-full"
        style={{ display: activePage === "dotd" ? "block" : "none" }}
      >
        <DriverOfTheDayAwardStandings screenWidth={screenWidth} />
      </div>
    </div>
  );
}
