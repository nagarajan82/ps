import { useEffect, useMemo, useState } from "react";
import driverInfo from "../../data/driver.json";
import constructorInfo from "../../data/constructors.json";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

type ConstructorResults = {
  constructorId: string;
  constructorName: string;
  results: [
    {
      round: string;
      points: number;
      raceName: string;
      country: string;
    }
  ];
  totalPoints: number;
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
type ResultsProps = {
  constructorResults: ConstructorResults[];
  // sprintResults: sprintResultsProp[];
  screenWidth: number;
  activeSpecificTeam: string;
  // raceSchedule: RaceSchedule[];
};

export function SpecificConstructorStandingsWidget({
  constructorResults,
  // sprintResults,
  screenWidth,
  activeSpecificTeam,
}: ResultsProps) {
  const mobilePinned = screenWidth <= 450 ? "left" : "";
  const mobileWidth = screenWidth <= 450 ? screenWidth - 32 : 1162;

  const [teamData, setTeamData] = useState<ConstructorResults>();

  useEffect(() => {
    const specificTeamInfo = constructorResults.find((teamNameInfo) => {
      // console.log(teamNameInfo.constructorName);
      return teamNameInfo.constructorName === activeSpecificTeam;
    });
    setTeamData(specificTeamInfo);
  }, [activeSpecificTeam]);

  return (
    <div className="flex flex-col max-w-md">
      {constructorInfo.map((team) => (
        <div
          key={team.id}
          className="flex w-full my-4 pb-2 border-b-2 border-gray-300"
          style={{
            display: activeSpecificTeam === team.name ? "block" : "none",
          }}
        >
          <div className="flex justify-between mt-2">
            <img src={team.logoUrl} alt="team photo" className="w-1/3" />
            <img
              src={team.carUrl}
              alt="team photo"
              className="w-2/3 object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex h-full gap-2 justify-between items-center">
              <p className="font-bold text-2xl">{team.fullTeamName}</p>
              <img
                src={team.smallLogoUrl}
                alt="team photo"
                className="w-16 h-full rounded-md"
              />
            </div>
          </div>
        </div>
      ))}
      <div className="">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Current Season Stats</h3>
          <div className="text-sm mr-2">
            Season Total: {teamData?.totalPoints}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2 py-1 border-2 border-gray-200">
          <p className="w-12 pl-1">ROUND</p>
          <p className="w-28">GRAND PRIX</p>
          <p className="w-10">PTS</p>
        </div>
        {teamData?.results.map((selectedCountry) => (
          <div
            key={selectedCountry.round}
            className="flex justify-between py-1 [&:nth-child(odd)]:bg-gray-100
[&:nth-child(even)]:bg-white border-2 border-t-0 border-gray-200"
          >
            <p className="w-12 pl-1">{selectedCountry.round}</p>
            <p className="w-28">{selectedCountry.country}</p>
            <p className="w-10">{selectedCountry?.points}</p>
          </div>
        ))}
      </div>
      {constructorInfo.map((team) => (
        <div
          className="flex w-full"
          key={team.id}
          style={{
            display: activeSpecificTeam === team.name ? "block" : "none",
          }}
        >
          <div className="flex w-full mt-4">
            <div className="flex flex-col w-full justify-center">
              <div className="flex justify-between">
                <p className="w-full my-1 font-bold">Full Team Name:</p>
                <p className="w-full my-1 self-end">{team.fullTeamName}</p>
              </div>
              <div className="flex justify-between">
                <p className="w-full my-1 font-bold">Nationality:</p>
                <p className="w-full my-1 self-end">{team.nationality}</p>
              </div>
              <div className="flex justify-between">
                <p className="w-full my-1 font-bold">Base:</p>
                <p className="w-full my-1 self-end">{team.base}</p>
              </div>
              <div className="flex justify-between">
                <p className="w-full my-1 font-bold">Team Chief:</p>
                <p className="w-full my-1 self-end">{team.teamChief}</p>
              </div>
              <div className="flex justify-between">
                <p className="w-full my-1 font-bold">Technical Chief:</p>
                <p className="w-full my-1 self-end">{team.techChief}</p>
              </div>
              <div className="flex justify-between">
                <p className="w-full my-1 font-bold">Chassis:</p>
                <p className="w-full my-1 self-end">{team.chassis}</p>
              </div>
              <div className="flex justify-between">
                <p className="w-full my-1 font-bold">Power Unit:</p>
                <p className="w-full my-1 self-end">{team.powerUnit}</p>
              </div>
              <div className="flex justify-between">
                <p className="w-full my-1 font-bold">First Team Entry:</p>
                <p className="w-full my-1 self-end">{team.firstTeamEntry}</p>
              </div>
              <div className="flex justify-between">
                <p className="w-full my-1 font-bold">World Championships:</p>
                <p className="w-full my-1 self-end">
                  {team.worldChampionships}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
