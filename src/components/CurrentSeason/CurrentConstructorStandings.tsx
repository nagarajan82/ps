import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

type ScreenWidthProps = {
  screenWidth: number;
};

export function CurrentConstructorStandings({ screenWidth }: ScreenWidthProps) {
  const getConstructorStandings = async () => {
    const response = await axios
      .get("https://ergast.com/api/f1/2023/constructorStandings.json")
      .catch((err) => console.log(err));

    if (response) {
      const constructorStandings =
        response.data.MRData.StandingsTable.StandingsLists[0]
          .ConstructorStandings;
      setRowData(constructorStandings);
    }
  };
  const gridPositionWidth = screenWidth <= 450 ? 60 : 100;
  const gridConstructorWidth = screenWidth <= 450 ? 130 : 150;
  const gridWinWidth = screenWidth <= 450 ? 65 : 80;
  const gridPointsWidth = screenWidth <= 450 ? 85 : 100;
  const gridMobileWidth = screenWidth <= 450 ? screenWidth - 32 : 435;

  const [rowData, setRowData] = useState([]);

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "position",
      headerName: "",
      width: gridPositionWidth,
      headerClass: "sub-headers" as string,
      cellClass: "my-class",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      headerName: "Constructor",
      field: "Constructor.name",
      width: gridConstructorWidth,
      cellClass: "cell-left",
      headerClass: "sub-headers-name" as string,
    },
    {
      field: "wins",
      width: gridWinWidth,
      headerClass: "sub-headers" as string,
      cellClass: "centered",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
    },
    {
      field: "points",
      width: gridPointsWidth,
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
    getConstructorStandings();
  }, []);

  return (
    <div className="mt-4">
      <div
        className="ag-theme-f1-medium"
        style={{ height: 395, width: gridMobileWidth }}
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
