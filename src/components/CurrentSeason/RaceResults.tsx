import { getQualiResults } from "../../hooks/getQualiResults";
import { getRaceResults } from "../../hooks/getRaceResults";
import { getRecentRaceResults } from "../../hooks/getRecentRaceResults";
import { getSprintResults } from "../../hooks/getSprintResults";
import { RaceResultsWidget } from "../../widgets/CurrentSeason/RaceResultsWidget";
import trackInfo from "../../data/trackInfo.json";
import { RaceResultsOverview } from "./RaceResultsOverview";
import { getRaceSchedule } from "../../hooks/getRaceSchedule";
import { useState } from "react";

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

export function RaceResults({ screenWidth }: ScreenWidthProps) {
  // get full race results
  // - constructor point results including DNFs
  // - if sprint, constructor point results including DNFs

  // - driver "finishing position" points + DNFs: position, driver, team, laps, time/retired, pts
  // - if sprint, driver "finishing position" points + DNFs: position, driver, team, laps, time/retired, pts

  // - pole / quali results (by driver): position, driver, team, q1, q2, q3 and laps

  // - strating race grid (aka quali or sprint + penalties, grid changes, etc): position, driver, team, time (quali time)

  // - each round of practice results (by driver): position, driver, team, time, gap and laps

  // - pit stop summary: stops, driver, team, lap, time of day, time, total time for stop

  // - fastest lap: position, driver, team, lap, time of day, time, avg speed

  // - driver of the day: driver + voting results

  // create a focused view for each grand prix but also table(s) to view all races at once for specific info (DOTD, pole, etc in one mega table)
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

  if (!raceResults) return null;
  if (!sprintResults) return null;

  if (qualiLoading || loading) {
    return (
      <div className="ml-8 mt-6">
        <p>Loading...</p>
      </div>
    );
  }
  if (raceResults.length === 0) {
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
          ? "race-schedule-container-mobile m-4"
          : "race-schedule-container"
      }
    >
      <div>
        <RaceResultsWidget
          qualiResults={qualiStandings as any}
          sprintResults={sprintResults as any}
          raceResults={updatedRaceSchedule as any}
          raceSchedule={raceSchedule as any}
          screenWidth={screenWidth}
        />
      </div>
    </div>
  );
}
