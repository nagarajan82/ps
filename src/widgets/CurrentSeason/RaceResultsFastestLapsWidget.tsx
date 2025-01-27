import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

type RacesResult = {
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

type Props = {
  raceResult: RacesResult;
  screenWidth: number;
};

export function RaceResultsFastestLapsWidget({
  raceResult,
  screenWidth,
}: Props) {
  const mobilePinned = screenWidth <= 450 ? "left" : "";

  const mobileWidth = screenWidth <= 450 ? screenWidth - 32 : 650;
  const mobileHeight = screenWidth <= 450 ? 661 : 661;
  const [driverToggle, setDriverToggle] = useState(
    screenWidth <= 450 ? false : true
  );
  const [rowData, setRowData] = useState([]);
  const mobileCol = [
    {
      field: "placement",
      headerName: "",
      width: 50,
      headerClass: "sub-headers" as string,
      cellClass: "my-class",
      pinned: "left",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "Driver.code",
      headerName: "Driver",
      width: 50,
      pinned: "left",
      headerClass: "sub-headers" as string,
      cellClass: "left",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "FastestLap.lap",
      headerName: "Lap",
      width: 50,
      headerClass: "sub-headers" as string,
      cellClass: "centered",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "FastestLap.Time.time",
      headerName: "Time",
      width: 80,
      headerClass: "sub-headers" as string,
      cellClass: "centered",
      sort: "desc" as string,
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "FastestLap.AverageSpeed.speed",
      headerName: "Avg Speed",
      width: 90,
      headerClass: "sub-headers" as string,
      cellClass: "centered",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      headerName: "Constructor",
      field: "Constructor.name",
      width: 140,
      cellClass: "centered",
      headerClass: "sub-headers" as string,
    },
  ];
  const fullScreenCol = [
    {
      field: "placement",
      headerName: "",
      width: 50,
      headerClass: "sub-headers" as string,
      cellClass: "my-class",
      pinned: "left",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "Driver.code",
      headerName: "Driver",
      width: 50,
      pinned: "left",
      headerClass: "sub-headers" as string,
      cellClass: "left",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "FastestLap.lap",
      headerName: "Lap",
      width: 50,
      headerClass: "sub-headers" as string,
      cellClass: "centered",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "FastestLap.Time.time",
      headerName: "Time",
      width: 120,
      headerClass: "sub-headers" as string,
      cellClass: "centered",
      sort: "desc" as string,
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "FastestLap.AverageSpeed.speed",
      headerName: "Avg Speed",
      width: 120,
      headerClass: "sub-headers" as string,
      cellClass: "centered",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "position",
      headerName: "Race Position",
      width: 110,
      headerClass: "sub-headers" as string,
      cellClass: "centered",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      headerName: "Constructor",
      field: "Constructor.name",
      width: 140,
      cellClass: "centered",
      headerClass: "sub-headers" as string,
    },
  ];
  const [columnDefs, setColumnDefs] = useState(
    screenWidth <= 450 ? mobileCol : fullScreenCol
  );

  useEffect(() => {
    const sortedArray = raceResult.Results.sort((a, b) => {
      if (a.FastestLap && b.FastestLap) {
        return a.FastestLap.Time.time.localeCompare(b.FastestLap.Time.time);
      } else if (a.FastestLap && !b.FastestLap) {
        return -1;
      } else if (!a.FastestLap && b.FastestLap) {
        return 1;
      } else {
        // If both are undefined, treat them as equal and sort by position
        return Number(a.position) - Number(b.position);
      }
    });
    const addNewPlacement = sortedArray.map((obj, index) => {
      return { ...obj, placement: index + 1 };
    });
    setRowData(addNewPlacement as any);
  }, []);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
    }),
    []
  );

  function handleClick() {
    setColumnDefs(mobileCol);
    setDriverToggle(!driverToggle);
  }

  return (
    <div
      className="ag-theme-f1-small"
      style={{ height: mobileHeight, width: mobileWidth }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs as any}
        defaultColDef={defaultColDef}
      />
    </div>
  );
}
