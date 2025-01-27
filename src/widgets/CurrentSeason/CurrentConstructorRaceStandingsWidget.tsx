import { useEffect, useMemo, useState } from "react";
import driver from "../../data/driver.json";
import constructor from "../../data/constructors.json";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

type RaceResultsProp = {
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

type RaceResultsProps = {
  raceResults: RaceResultsProp[];
  screenWidth: number;
};

export function CurrentConstructorRaceStandingsWidget({
  raceResults,
  screenWidth,
}: RaceResultsProps) {
  const mobilePinned = screenWidth <= 450 ? "left" : "";
  const mobileWidth = screenWidth <= 450 ? screenWidth - 32 : 1162;

  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "constructorName",
      headerName: "Constructor",
      width: 135,
      pinned: mobilePinned,
      cellClass: "cell-left",
      headerClass: "sub-headers-name" as string,
    },
    {
      headerName: "BHR" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.0.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "KSA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.1.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "AUS" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.2.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "AZE" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.3.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "MIA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.4.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "IMOL" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.5.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "MON" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.6.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "ESP" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.7.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "CAN" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.8.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "AUT" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.9.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "ENG" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.10.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "HUN" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.11.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "BEL" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.12.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "NED" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.13.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "ITA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.14.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "SGP" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.15.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "JPN" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.16.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "QAT" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.17.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "COTA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.18.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "MEX" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.19.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "BRA" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.20.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "VEG" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.21.points",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      cellClass: "centered",
    },
    {
      headerName: "ABU" as string,
      headerClass: "sub-headers" as string,
      width: 42,
      field: "results.22.points",
      hide: "results.22.hide",
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
    const constructorArray = constructor.map((cons) => {
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

    setRowData(constructorsWithTotalPoints as any);
  }, [raceResults]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      suppressMovable: true,
    }),
    []
  );
  if (!rowData) return null;
  return (
    <div className="mt-4">
      <div
        className="ag-theme-f1-small"
        style={{ height: "351px", width: mobileWidth }}
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
