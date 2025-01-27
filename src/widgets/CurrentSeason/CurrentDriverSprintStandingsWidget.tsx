import { useEffect, useMemo, useState } from "react";
import driver from "../../data/driver.json";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

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

type sprintResultsProps = {
  sprintResults: sprintResultsProp[];
  screenWidth: number;
};

// type resultsByDriver = {
//   name: string;
//   nickName: string;
//   totalPoints: number;
//   drivers: {
//     driverName: string;
//     driverCode: string;
//     driverPoints: number;
//   };
// };

// interface DriverInfo {
//   totalPoints: number;
//   driverId: string;
//   driverName: string;
//   results: {
//     round: string;
//     position: string;
//     time: string;
//     points: string;
//     raceName: string;
//     hide: boolean;
//   };
// }

export function CurrentDriverSprintStandingsWidget({
  sprintResults,
  screenWidth,
}: sprintResultsProps) {
  const mobilePinned = screenWidth <= 450 ? "left" : "";
  const mobileWidth = screenWidth <= 450 ? screenWidth - 32 : 448;
  const [driverToggle, setDriverToggle] = useState(
    screenWidth <= 450 ? false : true
  );
  const [rowData, setRowData] = useState([]);
  const colData = [
    {
      field: driverToggle ? "driverCode" : "driverName",
      headerName: "Driver",
      width: screenWidth <= 450 ? (driverToggle ? 70 : 135) : 135,
      cellClass: "cell-left",
      pinned: mobilePinned,
      headerClass: "sub-headers-name" as string,
    },
    {
      headerName: "AZE" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.0.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "AUT" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.1.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "BEL" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.2.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "QAT" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.3.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "COTA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.4.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "BRA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.5.points",
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
      field: screenWidth <= 450 ? "driverCode" : "driverName",
      headerName: "Driver",
      width: screenWidth <= 450 ? 70 : 135,
      cellClass: "cell-left",
      pinned: mobilePinned,
      headerClass: "sub-headers-name" as string,
    },
    {
      headerName: "AZE" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.0.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "AUT" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.1.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "BEL" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.2.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "QAT" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.3.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "COTA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.4.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "BRA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.5.points",
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
    const driverArray = driver.map((dr) => {
      const driverResults = sprintResults.filter((race) =>
        race?.SprintResults.some(
          (result) => result.Driver.driverId === dr.driverId
        )
      );
      const results = driverResults.map((result) => {
        const raceResult = result.SprintResults.find(
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

      return {
        constructorId: dr.team,
        driverId: dr.driverId,
        driverName: dr.name,
        driverCode: dr.code,
        results: results,
      };
    });

    const driversWithTotalPoints = driverArray.map((driver) => {
      const totalPoints = driver.results.reduce((accumulator, result) => {
        return accumulator + parseInt(result.points as string);
      }, 0);

      return {
        ...driver,
        totalPoints,
      };
    });
    setRowData(driversWithTotalPoints as any);
  }, [sprintResults]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      suppressMovable: true,
    }),
    []
  );
  if (!rowData) return null;

  function handleClick() {
    setColumnDefs(colData);
    setDriverToggle(!driverToggle);
  }

  return (
    <div className="">
      <button
        className={`p-1 border-2 standings-btn rounded-lg my-4 mx-auto text-sm ${
          screenWidth <= 450 ? "w-full " : "w-max"
        }`}
        onClick={handleClick}
      >
        {driverToggle ? "Show Driver Code" : "Show Driver Names"}
      </button>
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
