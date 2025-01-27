import { useEffect, useMemo, useState } from "react";
import driverInfo from "../../data/driver.json";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

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
  activeSpecificDriver: string;
  raceSchedule: RaceSchedule[];
};
type DriverDataProps = {
  constructorId: string;
  driverId: string;
  driverName: string;
  driverCode: string;
  raceResultsArray: [
    {
      round: string;
      country: string;
      position: string;
      time: string;
      points: string;
      raceName: string;
      test: string;
    }
  ];
  sprintResultsArray: sprintResultsProp[];
  qualiResultsArray: [
    {
      round: string;
      qualiInfo: {
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
      };
      raceName: string;
    }
  ];
  combinedPointsArray: [
    {
      round: string;
      combinedPoints: number;
      raceName: string;
      country: string;
    }
  ];
  totalPoints: number;
};

export function SpecificDriverStandingsWidget({
  raceResults,
  qualiStandings,
  sprintResults,
  screenWidth,
  raceSchedule,
  activeSpecificDriver,
}: ResultsProps) {
  const mobilePinned = screenWidth <= 450 ? "left" : "";
  const mobileWidth = screenWidth <= 450 ? screenWidth - 32 : 1162;

  const [driverToggle, setDriverToggle] = useState(
    screenWidth <= 450 ? false : true
  );
  const [driverData, setDriverData] = useState<DriverDataProps>();

  useEffect(() => {
    const driverRaceArray = driverInfo.map((dr) => {
      const driverResults = raceResults.filter((race) =>
        race?.Results.some((result) => result.Driver.driverId === dr.driverId)
      );

      const qualiResults = qualiStandings.filter((race) =>
        race?.QualifyingResults.some(
          (result) => result.Driver.driverId === dr.driverId
        )
      );

      //check if race also had a sprint race to add those points
      const driverSprintResults = sprintResults.filter((race) =>
        race?.SprintResults.some(
          (result) => result.Driver.driverId === dr.driverId
        )
      );

      const sprintResultsArray = driverSprintResults.map((result) => {
        const sprintResult = result.SprintResults.find(
          (r) => r.Driver.driverId === dr.driverId
        );
        return {
          round: result.round,
          position: sprintResult?.position ?? "DNF",
          time: sprintResult?.Time?.time ?? "DNF",
          points: sprintResult?.points,
          raceName: result.raceName,
        };
      });

      const qualiResultsArray = qualiResults.map((result) => {
        const qauliResult = result.QualifyingResults.find(
          (r) => r.Driver.driverId === dr.driverId
        );
        return {
          round: result.round,
          qualiInfo: qauliResult,
          raceName: result.raceName,
        };
      });

      const raceResultsArray = driverResults.map((result) => {
        const raceResult = result.Results.find(
          (r) => r.Driver.driverId === dr.driverId
        );
        return {
          round: result.round,
          country: result.Circuit.Location.country,
          position: raceResult?.position ?? "DNF",
          time: raceResult?.Time?.time ?? "DNF",
          points: raceResult?.points,
          raceName: result.raceName,
          test: raceResult?.status,
        };
      });

      const combinedPointsArray = raceResultsArray.map((raceResult) => {
        const sprintResult = sprintResultsArray.find(
          (sprintResult) => sprintResult.round === raceResult.round
        );
        const combinedPoints =
          (Number(raceResult.points) ?? 0) + Number(sprintResult?.points ?? 0);
        return {
          round: raceResult.round,
          combinedPoints: combinedPoints,
          raceName: raceResult.raceName,
          country: raceResult.country,
        };
      });

      return {
        constructorId: dr.team,
        driverId: dr.driverId,
        driverName: dr.name,
        driverCode: dr.code,
        raceResultsArray: raceResultsArray,
        sprintResultsArray: sprintResultsArray,
        qualiResultsArray: qualiResultsArray,
        combinedPointsArray: combinedPointsArray,
      };
    });
    const driversWithTotalPoints = driverRaceArray.map((driver) => {
      const racePoints = driver.raceResultsArray.reduce(
        (accumulator, result) => {
          return accumulator + parseInt(result.points as string);
        },
        0
      );

      const sprintPoints = driver.sprintResultsArray.reduce(
        (accumulator, result) => {
          return accumulator + parseInt(result.points as string);
        },
        0
      );

      const totalPoints = racePoints + sprintPoints;

      return {
        ...driver,
        totalPoints,
      };
    });

    const specificDriverInfo = driversWithTotalPoints.find(
      (driverCodeInfo) => driverCodeInfo.driverCode === activeSpecificDriver
    );

    setDriverData(specificDriverInfo as any);
  }, [raceResults, sprintResults, activeSpecificDriver]);

  if (!driverData) return null;
  function handleClick() {
    // setColumnDefs(colData);
    setDriverToggle(!driverToggle);
  }

  const updatedData = {
    ...driverData,
    breakdownByCountry: driverData.raceResultsArray.map((raceResult) => {
      const quali = driverData.qualiResultsArray.find((qualiResult) => {
        return qualiResult.round === raceResult.round;
      });

      return {
        round: raceResult.round,
        country: raceResult.country,
        racePosition: raceResult.position,
        raceTime: raceResult.time,
        racePoints: raceResult.points,
        raceName: raceResult.raceName,
        testing: raceResult.test,
        qualiInfo: quali?.qualiInfo,
        combinedPoints: driverData.combinedPointsArray.find(
          (combinedPoints) => combinedPoints.round === raceResult.round
        )?.combinedPoints,
      };
    }),
  };

  return (
    <div className="flex flex-col max-w-md">
      {driverInfo.map((driver) => (
        <div
          key={driver.id}
          className="flex  my-4 pb-2 border-b-2 border-gray-300"
          style={{
            display: activeSpecificDriver === driver.code ? "block" : "none",
          }}
        >
          <img
            src={driver.imgUrl}
            alt="driver photo"
            className="rounded-lg driver-img"
          />
          <div className="flex justify-between mt-2">
            <div className="flex flex-col">
              <div className="flex h-full gap-2 my-2 items-center">
                <p className="font-light text-2xl">{driver.permanentNumber}</p>
                <img
                  src={driver.flagUrl}
                  alt="driver photo"
                  className="w-14 h-8 rounded-md"
                />
                <p className="font-bold text-xl">{driver.code}</p>
              </div>
              <p className="font-bold text-2xl">{driver.name}</p>
            </div>
            <img src={driver.hemletUrl} alt="driver photo" className="w-1/3" />
          </div>
        </div>
      ))}
      <div className="">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Current Season Stats</h3>
          <div className="text-sm mr-2">
            Season Total: {driverData.totalPoints}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2 py-1 border-2 border-gray-200">
          <p className="w-28 pl-1">GRAND PRIX</p>
          <p className="w-24">QUALIFYING</p>
          <p className="w-12 flex-auto">RACE POSITION</p>
          <p className="w-8">PTS</p>
        </div>
        {updatedData.breakdownByCountry.map((selectedCountry) => (
          <div
            key={selectedCountry.round}
            className="flex justify-between py-1 [&:nth-child(odd)]:bg-gray-100
[&:nth-child(even)]:bg-white border-2 border-t-0 border-gray-200"
          >
            <p className="w-28 pl-1">{selectedCountry.country}</p>
            <p className="w-24">{selectedCountry?.qualiInfo?.position}</p>
            <p className="w-12 flex-auto">{selectedCountry.racePosition}</p>
            <p className="w-8">{selectedCountry.combinedPoints}</p>
          </div>
        ))}
      </div>
      {driverInfo.map((driver) => (
        <div
          className="flex "
          key={driver.id}
          style={{
            display: activeSpecificDriver === driver.code ? "block" : "none",
          }}
        >
          <div className="flex w-full mt-4">
            <div className="flex flex-col w-1/2">
              <p className="w-full my-1 font-bold">Team:</p>
              <p className="w-full my-1 font-bold">Nationality:</p>
              <p className="w-full my-1 font-bold">Place of Birth:</p>
              <p className="w-full my-1 font-bold">Date of Birth:</p>
            </div>
            <div className="flex flex-col w-1/2">
              <p className="w-full my-1">{driver.teamName}</p>
              <p className="w-full my-1">{driver.nationality}</p>
              <p className="w-full my-1">{driver.placeOfBirth}</p>
              <p className="w-full my-1">{driver.dateOfBirth}</p>
            </div>
          </div>
          <p className="mt-4">
            View {driver.name}'s{" "}
            <a href={driver.url} className="text-blue-700">
              Wikipedia
            </a>{" "}
            page to learn more!
          </p>
        </div>
      ))}
    </div>
  );
}
