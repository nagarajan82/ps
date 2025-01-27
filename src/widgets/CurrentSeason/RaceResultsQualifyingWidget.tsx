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

type Props = {
  qualiResult: QualiResult;
  screenWidth: number;
};

export function RaceResultsQualifyingWidget({
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
      field: "position",
      headerName: "",
      width: 50,
      headerClass: "sub-headers" as string,
      cellClass: "my-class",
      pinned: "left",
      sort: "asc" as string,
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
      field: "Q1",
      width: 100,
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
      field: "Q2",
      width: 100,
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
      field: "Q3",
      width: 100,
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
      headerName: "Constructor",
      field: "Constructor.name",
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

  useEffect(() => {
    setRowData(qualiResult.QualifyingResults as any);
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
