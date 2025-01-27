import { useEffect, useMemo, useState } from "react";
import driver from "../../data/driver.json";
import driverOfTheDayData from "../../data/driverOfTheDay.json";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// type raceResultsProp = {
//   season: string;
//   round: string;
//   url: string;
//   raceName: string;
//   Circuit: {
//     circuitId: string;
//     url: string;
//     circuitName: string;
//     Location: {
//       lat: string;
//       long: string;
//       locality: string;
//       country: string;
//     };
//   };
//   date: string;
//   time: string;
//   Results: [
//     {
//       number: string;
//       position: string;
//       positionText: string;
//       points: string;
//       Driver: {
//         driverId: string;
//         permanentNumber: string;
//         code: string;
//         url: string;
//         givenName: string;
//         familyName: string;
//         dateOfBirth: string;
//         nationality: string;
//       };
//       Constructor: {
//         constructorId: string;
//         url: string;
//         name: string;
//         nationality: string;
//       };
//       grid: string;
//       laps: string;
//       status: string;
//       Time: {
//         millis: string;
//         time: string;
//       };
//       FastestLap: {
//         rank: string;
//         lap: string;
//         Time: {
//           time: string;
//         };
//         AverageSpeed: {
//           units: string;
//           speed: string;
//         };
//       };
//     }
//   ];
// };
// type sprintResultsProp = {
//   season: string;
//   round: string;
//   url: string;
//   raceName: string;
//   Circuit: {
//     circuitId: string;
//     url: string;
//     circuitName: string;
//     Location: {
//       lat: string;
//       long: string;
//       locality: string;
//       country: string;
//     };
//   };
//   date: string;
//   time: string;
//   SprintResults: [
//     {
//       number: string;
//       position: string;
//       positionText: string;
//       points: string;
//       Driver: {
//         driverId: string;
//         permanentNumber: string;
//         code: string;
//         url: string;
//         givenName: string;
//         familyName: string;
//         dateOfBirth: string;
//         nationality: string;
//       };
//       Constructor: {
//         constructorId: string;
//         url: string;
//         name: string;
//         nationality: string;
//       };
//       grid: string;
//       laps: string;
//       status: string;
//       Time: {
//         millis: string;
//         time: string;
//       };
//       FastestLap: {
//         rank: string;
//         lap: string;
//         Time: {
//           time: string;
//         };
//         AverageSpeed: {
//           units: string;
//           speed: string;
//         };
//       };
//     }
//   ];
// };
type ResultsProps = {
  // raceResults: raceResultsProp[];
  // sprintResults: sprintResultsProp[];
  screenWidth: number;
};

export function DriverOfTheDayAwardStandings({ screenWidth }: ResultsProps) {
  const mobilePinned = screenWidth <= 450 ? "left" : "";
  const mobileHeight =
    screenWidth <= 1450
      ? screenWidth <= 450
        ? 50 + 31 * driverOfTheDayData[driverOfTheDayData.length - 1].round
        : 60 + 31 * driverOfTheDayData[driverOfTheDayData.length - 1].round
      : 44 + 31 * driverOfTheDayData[driverOfTheDayData.length - 1].round;
  const mobileWidth =
    screenWidth <= 1450
      ? screenWidth <= 450
        ? screenWidth - 32
        : screenWidth - 308
      : 555;

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
      field: "percentVote",
      headerName: "Percent of Vote",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      width: 130,
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
    setRowData(driverOfTheDayData as any);
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
