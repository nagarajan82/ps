import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export function CurrentDriverStandingsHome() {
  const getDriverStandings = async () => {
    const response = await axios
      .get("https://ergast.com/api/f1/2023/driverStandings.json")
      .catch((err) => console.log(err));

    if (response) {
      const driverStandings =
        response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      setRowData(driverStandings);
      // console.log("Driver:", driverStandings);
    }
  };

  const [rowData, setRowData] = useState([]);

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "position",
      headerName: "",
      width: 50,
      headerClass: "sub-headers" as string,
      cellClass: "my-class",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      headerName: "Driver",
      width: 140,
      headerClass: "sub-headers-name" as string,
      cellClass: "cell-left",
      valueGetter: (p: {
        data: { Driver: { givenName: string; familyName: string } };
      }) => {
        return p.data.Driver.givenName + " " + p.data.Driver.familyName;
      },
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "Driver.code",
      headerName: "Code",
      width: 50,
      cellClass: "centered",
      headerClass: "sub-headers" as string,
    },
    {
      headerName: "Constructor",
      field: "Constructors.0.name",
      width: 140,
      cellClass: "centered",
      headerClass: "sub-headers" as string,
    },
    {
      field: "wins",
      width: 50,
      headerClass: "sub-headers" as string,
      cellClass: "centered",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "points",
      width: 80,
      headerClass: "sub-headers" as string,
      cellClass: "my-class",
      sort: "desc" as string,
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
    }),
    []
  );

  useEffect(() => {
    getDriverStandings();
  }, []);

  return (
    <div className="">
      <h3 className="p-2 text-2xl uppercase">Current Driver Standings</h3>
      <div className="ag-theme-f1-medium" style={{ height: 369, width: 530 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs as any}
          defaultColDef={defaultColDef}
        />
      </div>
    </div>
  );
}
