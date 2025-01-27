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

export function RaceResultsDriverWidget({ raceResult, screenWidth }: Props) {
  const mobilePinned = screenWidth <= 450 ? "left" : "";

  const mobileWidth = screenWidth <= 450 ? screenWidth - 32 : 650;
  const mobileHeight = screenWidth <= 450 ? 661 : 661;
  const [driverToggle, setDriverToggle] = useState(
    screenWidth <= 450 ? false : true
  );
  const [rowData, setRowData] = useState([]);
  const mobileCol = [
    {
      field: "position",
      headerName: "",
      width: 50,
      headerClass: "sub-headers" as string,
      cellClass: "my-class",
      pinned: "left",
      sort: "asc" as string,
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    // {
    //   field: driverToggle ? "Driver.code" : "Driver.familyName",
    //   headerName: "Driver",
    //   width: screenWidth <= 450 ? (driverToggle ? 70 : 135) : 135,
    //   cellClass: "cell-left",
    //   pinned: mobilePinned,
    //   headerClass: "sub-headers-name" as string,
    // },
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
      field: "points",
      headerName: "Pts",
      width: 50,
      headerClass: "sub-headers" as string,
      cellClass: "my-class",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "laps",
      headerName: "Laps",
      width: 50,
      headerClass: "sub-headers" as string,
      cellClass: "centered",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "Time.time",
      headerName: "Time",
      width: 90,
      headerClass: "sub-headers" as string,
      cellClass: "centered",
      comparator: (timeA: string, timeB: string) => {
        if (timeA === undefined && timeB === undefined) {
          return 0;
        } else if (timeA === undefined) {
          return 1;
        } else if (timeB === undefined) {
          return -1;
        } else {
          const timeANum = timeToSeconds(timeA);
          const timeBNum = timeToSeconds(timeB);
          return timeANum - timeBNum;
        }
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 80,
      cellClass: "centered",
      headerClass: "sub-headers" as string,
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
      field: "position",
      headerName: "",
      width: 50,
      headerClass: "sub-headers" as string,
      cellClass: "my-class",
      pinned: "left",
      sort: "asc" as string,
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    // {
    //   field: driverToggle ? "Driver.code" : "Driver.familyName",
    //   headerName: "Driver",
    //   width: screenWidth <= 450 ? (driverToggle ? 70 : 135) : 135,
    //   cellClass: "cell-left",
    //   pinned: mobilePinned,
    //   headerClass: "sub-headers-name" as string,
    // },
    {
      field: "Driver.code",
      headerName: "Driver",
      width: 80,
      pinned: "left",
      headerClass: "sub-headers" as string,
      cellClass: "sub-headers-name-2",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "laps",
      headerName: "Laps",
      width: 80,
      headerClass: "sub-headers-name" as string,
      cellClass: "sub-headers-name",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "Time.time",
      headerName: "Time",
      width: 100,
      comparator: (timeA: string, timeB: string) => {
        const timeANum = timeToSeconds(timeA);
        const timeBNum = timeToSeconds(timeB);
        return timeANum - timeBNum;
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      headerName: "Constructor",
      field: "Constructor.name",
      width: 140,
    },
    {
      field: "points",
      headerName: "Pts",
      width: 50,
      cellClass: "my-class",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
  ];
  const [columnDefs, setColumnDefs] = useState(
    screenWidth <= 450 ? mobileCol : fullScreenCol
  );

  function timeToSeconds(time: string): number {
    const [minutes, seconds] = time.split(":");
    const totalSeconds = Number(minutes) * 60 + Number(seconds);
    return totalSeconds;
  }

  useEffect(() => setRowData(raceResult.Results as any), []);

  // console.log(rowData);

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
    <div className="">
      {/* <h3 className="ml-2 mb-1 font-bold text-lg">Race Result</h3> */}

      {/* <button
        className={`p-1 border-2 standings-btn rounded-lg my-4 mx-auto text-sm ${
          screenWidth <= 450 ? "w-full " : "w-max"
        }`}
        onClick={handleClick}
      >
        {driverToggle ? "Show Driver Code" : "Show Driver Names"}
      </button> */}
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
    </div>
  );
}
