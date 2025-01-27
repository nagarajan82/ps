import { useEffect, useMemo, useState } from "react";
import driver from "../../data/driver.json";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

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
type ResultsProps = {
  raceResults: raceResultsProp[];
  sprintResults: sprintResultsProp[];
  screenWidth: number;
};

export function CurrentDriverRaceStandingsWidget({
  raceResults,
  sprintResults,
  screenWidth,
}: ResultsProps) {
  const mobilePinned = screenWidth <= 450 ? "left" : "";
  // const mobileWidth = screenWidth <= 450 ? screenWidth - 32 : 1162;
  const mobileWidth =
    screenWidth <= 1450
      ? screenWidth <= 450
        ? screenWidth - 32
        : screenWidth - 308
      : 1162;

  const [driverToggle, setDriverToggle] = useState(
    screenWidth <= 450 ? false : true
  );

  const [pointsPositionToggle, setPointsPositionToggle] = useState(true);

  const [rowData, setRowData] = useState([]);
  const colData = [
    {
      field:
        screenWidth <= 450
          ? driverToggle
            ? "driverName"
            : "driverCode"
          : driverToggle
          ? "driverName"
          : "driverCode",
      headerName: "Driver",
      width: screenWidth <= 450 ? (driverToggle ? 135 : 70) : 135,
      cellClass: "cell-left",
      pinned: mobilePinned,
      headerClass: "sub-headers-name" as string,
    },
    {
      headerName: "BHR" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      // field: "combinedPointsArray.0.combinedPoints",
      field: pointsPositionToggle
        ? "combinedPointsArray.0.combinedPoints"
        : "raceResultsArray.0.position",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "KSA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      // field: "combinedPointsArray.1.combinedPoints",
      field: pointsPositionToggle
        ? "combinedPointsArray.1.combinedPoints"
        : "raceResultsArray.1.position",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "AUS" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      // field: "combinedPointsArray.2.combinedPoints",
      field: pointsPositionToggle
        ? "combinedPointsArray.2.combinedPoints"
        : "raceResultsArray.2.position",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "AZE" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.3.combinedPoints"
        : "raceResultsArray.3.position",
      // field: "combinedPointsArray.3.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "MIA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.4.combinedPoints"
        : "raceResultsArray.4.position",
      // field: "combinedPointsArray.4.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "IMOL" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.5.combinedPoints"
        : "raceResultsArray.5.position",
      // field: "combinedPointsArray.5.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "MON" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.6.combinedPoints"
        : "raceResultsArray.6.position",
      // field: "combinedPointsArray.6.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "ESP" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.7.combinedPoints"
        : "raceResultsArray.7.position",
      // field: "combinedPointsArray.7.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "CAN" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.8.combinedPoints"
        : "raceResultsArray.8.position",
      // field: "combinedPointsArray.8.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "AUT" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.9.combinedPoints"
        : "raceResultsArray.9.position",
      // field: "combinedPointsArray.9.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "ENG" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.10.combinedPoints"
        : "raceResultsArray.10.position",
      // field: "combinedPointsArray.10.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "HUN" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.11.combinedPoints"
        : "raceResultsArray.11.position",
      // field: "combinedPointsArray.11.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "BEL" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.12.combinedPoints"
        : "raceResultsArray.12.position",
      // field: "combinedPointsArray.12.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "NED" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.13.combinedPoints"
        : "raceResultsArray.13.position",
      // field: "combinedPointsArray.13.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "ITA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.14.combinedPoints"
        : "raceResultsArray.14.position",
      // field: "combinedPointsArray.14.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "SGP" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.15.combinedPoints"
        : "raceResultsArray.15.position",
      // field: "combinedPointsArray.15.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "JPN" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.16.combinedPoints"
        : "raceResultsArray.16.position",
      // field: "combinedPointsArray.16.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "QAT" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.17.combinedPoints"
        : "raceResultsArray.17.position",
      // field: "combinedPointsArray.17.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "COTA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.18.combinedPoints"
        : "raceResultsArray.18.position",
      // field: "combinedPointsArray.18.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "MEX" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.19.combinedPoints"
        : "raceResultsArray.19.position",
      // field: "combinedPointsArray.19.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "BRA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.20.combinedPoints"
        : "raceResultsArray.20.position",
      // field: "combinedPointsArray.20.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "VEG" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.21.combinedPoints"
        : "raceResultsArray.21.position",
      // field: "combinedPointsArray.21.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "ABU" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: pointsPositionToggle
        ? "combinedPointsArray.22.combinedPoints"
        : "raceResultsArray.22.position",
      // field: "combinedPointsArray.22.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      field: "totalPoints",
      headerName: "Total",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      sort: "desc" as string,
      width: 57,
      headerClass: "sub-headers" as string,
      cellClass: "my-class",
    },
  ];
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Driver",
      width: screenWidth <= 450 ? 70 : 135,
      field: screenWidth <= 450 ? "driverCode" : "driverName",
      cellClass: "cell-left",
      pinned: mobilePinned,
      headerClass: "sub-headers-name" as string,
    },
    {
      headerName: "BHR" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.0.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "KSA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.1.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "AUS" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.2.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "AZE" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.3.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "MIA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.4.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "IMOL" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.5.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "MON" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.6.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "ESP" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.7.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "CAN" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.8.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "AUT" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.9.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "ENG" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.10.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "HUN" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.11.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "BEL" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.12.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "NED" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.13.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "ITA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.14.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "SGP" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.15.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "JPN" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.16.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "QAT" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.17.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "COTA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.18.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "MEX" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.19.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "BRA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.20.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "VEG" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.21.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "ABU" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "combinedPointsArray.22.combinedPoints",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      field: "totalPoints",
      headerName: "Total",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      sort: "desc" as string,
      width: 57,
      headerClass: "sub-headers" as string,
      cellClass: "my-class",
    },
  ]);

  useEffect(() => {
    const driverRaceArray = driver.map((dr) => {
      const driverResults = raceResults.filter((race) =>
        race?.Results.some((result) => result.Driver.driverId === dr.driverId)
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

      const raceResultsArray = driverResults.map((result) => {
        const raceResult = result.Results.find(
          (r) => r.Driver.driverId === dr.driverId
        );
        return {
          round: result.round,
          position: raceResult?.position ?? "DNF",
          time: raceResult?.Time?.time ?? "DNF",
          points: raceResult?.points,
          raceName: result.raceName,
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
        };
      });

      return {
        constructorId: dr.team,
        driverId: dr.driverId,
        driverName: dr.name,
        driverCode: dr.code,
        raceResultsArray: raceResultsArray,
        sprintResultsArray: sprintResultsArray,
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

    setRowData(driversWithTotalPoints as any);
  }, [raceResults, sprintResults]);
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      suppressMovable: true,
    }),
    []
  );
  if (!rowData) return null;
  useEffect(() => {
    setColumnDefs(colData);
  }, [driverToggle, pointsPositionToggle]);

  const handleClick = () => {
    setDriverToggle(!driverToggle);
  };

  function handleClick2() {
    setPointsPositionToggle(!pointsPositionToggle);
  }

  return (
    <div className="">
      <div
        className={` my-3 ${screenWidth <= 450 ? "flex gap-2" : "flex-col"}`}
      >
        <button
          className={`p-1 border-2 standings-btn rounded-lg text-sm  ${
            screenWidth <= 450 ? "w-full" : "w-max mr-2"
          }`}
          onClick={handleClick}
        >
          {driverToggle ? "Show Driver Code" : "Show Driver Name"}
        </button>
        <button
          className={`p-1 border-2 standings-btn rounded-lg text-sm ${
            screenWidth <= 450 ? "w-full" : "w-max"
          }`}
          onClick={handleClick2}
        >
          {pointsPositionToggle ? "Show Position" : "Show Points"}
        </button>
      </div>
      <div
        className="ag-theme-f1-small"
        style={{ height: 661, width: mobileWidth }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs as any}
          defaultColDef={defaultColDef}
        />
      </div>
    </div>
  );
}
