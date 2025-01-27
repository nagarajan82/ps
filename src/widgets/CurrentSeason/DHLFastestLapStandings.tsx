import { useEffect, useMemo, useState } from "react";
import driver from "../../data/driver.json";
import fastestLapData from "../../data/fastestLap.json";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

type ResultsProps = {
  screenWidth: number;
};

export function DHLFastestLapStandings({ screenWidth }: ResultsProps) {
  const mobilePinned = screenWidth <= 450 ? "left" : "";
  const mobileHeight =
    screenWidth <= 1450
      ? screenWidth <= 450
        ? 50 + 30 * fastestLapData[fastestLapData.length - 1].round
        : 60 + 30 * fastestLapData[fastestLapData.length - 1].round
      : 44 + 31 * fastestLapData[fastestLapData.length - 1].round;
  const mobileWidth =
    screenWidth <= 1450
      ? screenWidth <= 450
        ? screenWidth - 32
        : screenWidth - 308
      : 655;

  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Country",
      width: 120,
      field: "country",
      cellClass: "cell-left",
      pinned: mobilePinned,
      headerClass: "sub-headers-name" as string,
    },
    {
      field: "driverName",
      headerName: "Driver",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      width: 150,
      headerClass: "sub-headers-name" as string,
      cellClass: "cell-left",
    },
    {
      field: "constructorName",
      headerName: "Constructor",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      width: 130,
      headerClass: "sub-headers-name" as string,
      cellClass: "cell-left",
    },
    {
      field: "time",
      headerName: "Time",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      width: 100,
      headerClass: "sub-headers-name" as string,
      cellClass: "cell-left",
    },
    {
      field: "finishingPosition",
      headerName: "Finishing Position",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      width: 150,
      headerClass: "sub-headers-name" as string,
      cellClass: "cell-left",
    },
  ]);

  useEffect(() => {
    setRowData(fastestLapData as any);
  }, []);
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      suppressMovable: true,
    }),
    []
  );
  if (!rowData) return null;

  return (
    <div
      className="ag-theme-f1-small"
      style={{ height: mobileHeight, width: mobileWidth}}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs as any}
        defaultColDef={defaultColDef}        
      />
    </div>
  );
}
