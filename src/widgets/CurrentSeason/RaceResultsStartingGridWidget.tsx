import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

type QualiResult = {
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
  qualiResult: QualiResult;
  raceResult: RacesResult;
  screenWidth: number;
};

export function RaceResultsStartingGridWidget({
  raceResult,
  qualiResult,
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
      field: "gridPosition",
      headerName: "Position",
      width: 90,
      headerClass: "sub-headers" as string,
      cellClass: "my-class",
      pinned: "left",
      sort: "asc" as string,
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "driver",
      headerName: "Driver",
      width: 70,
      headerClass: "sub-headers-name" as string,
      cellClass: "cell-left",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "qualifyingTime",
      headerName: "Time",
      width: 100,
      headerClass: "sub-headers" as string,
      cellClass: "centered",
      comparator: (timeA: string, timeB: string) => {
        const timeANum = timeToSeconds(timeA);
        const timeBNum = timeToSeconds(timeB);
        return timeANum - timeBNum;
      },
    },
    {
      headerName: "Constructor",
      field: "constructor",
      width: 140,
      cellClass: "centered",
      headerClass: "sub-headers" as string,
    },
  ];

  const [columnDefs, setColumnDefs] = useState(mobileCol);

  function timeToSeconds(time: string): number {
    const [minutes, seconds] = time.split(":");
    const totalSeconds = Number(minutes) * 60 + Number(seconds);
    return totalSeconds;
  }

  function compareTimes(time1: string, time2: string) {
    const time1Milliseconds = convertTimeToMilliseconds(time1);
    const time2Milliseconds = convertTimeToMilliseconds(time2);
    return time1Milliseconds - time2Milliseconds;
  }

  function convertTimeToMilliseconds(time: string) {
    const [minutes, seconds, milliseconds] = time.split(":").map(Number);
    return minutes * 60 * 1000 + seconds * 1000 + milliseconds;
  }

  useEffect(() => {
    // Filter out drivers without a time and sort by time in ascending order
    const qualifyingTimes = qualiResult.QualifyingResults.map((driver) => {
      if (driver.Q3) {
        return {
          driver: driver.Driver.code,
          time: driver.Q3,
        };
      } else if (driver.Q2) {
        return {
          driver: driver.Driver.code,
          time: driver.Q2,
        };
      } else if (driver.Q1) {
        return {
          driver: driver.Driver.code,
          time: driver.Q1,
        };
      } else {
        return {
          driver: driver.Driver.code,
          time: "No Time" as string,
        };
      }
    });

    const raceGrid = raceResult.Results.map((driver) => {
      return {
        constructor: driver.Constructor.name,
        driver: driver.Driver.code,
        grid: driver.grid === "0" ? "Pit Lane" : driver.grid,
      };
    });

    const combinedData = qualifyingTimes.map((qualifyingDriver) => {
      const raceDriver = raceGrid.find(
        (driver) => driver.driver === qualifyingDriver.driver
      );

      return {
        driver: qualifyingDriver.driver,
        qualifyingTime: qualifyingDriver.time as string,
        gridPosition: raceDriver ? raceDriver.grid : "N/A",
        constructor: raceDriver?.constructor,
      };
    });
    combinedData.sort((a, b) => {
      if (a.gridPosition === "0" && b.gridPosition !== "0") {
        return 1;
      } else if (b.gridPosition === "0" && a.gridPosition !== "0") {
        return -1;
      } else if (a.gridPosition === "0" && b.gridPosition === "0") {
        return compareTimes(a.qualifyingTime, b.qualifyingTime);
      } else {
        return Number(a.gridPosition) - Number(b.gridPosition);
      }
    });

    setRowData(combinedData as any);
  }, []);

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
