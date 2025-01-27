import { useEffect, useMemo, useState } from "react";
import fantasy from "../../data/fantasy.json";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// type fastestLaps = {
//   fastestLaps: [
//     {
//       round: number;
//       fastestLaps: [
//         {
//           number: number;
//           position: number;
//           positionText: string;
//           points: number;
//           Driver: {
//             driverId: string;
//             permanentNumber: number;
//             code: string;
//             url: string;
//             givenName: string;
//             familyName: string;
//             dateOfBirth: Date;
//             nationality: string;
//           };
//           Constructor: {
//             constructorId: string;
//             url: string;
//             name: string;
//             nationality: string;
//           };
//           grid: number;
//           laps: number;
//           status: string;
//           FastestLap: {
//             rank: number;
//             lap: number;
//             Time: {
//               time: number;
//             };
//             AverageSpeed: {
//               units: string;
//               speed: number;
//             };
//           };
//         }
//       ];
//     }
//   ];
// };

interface FastestLapDataProps {
  round: number;
  circuitId: string;
  circuitName: string;
  country: string;
  driverName: string;
  driverId: string;
  code: string;
  constructorId: string;
  constructorName: string;
  finishingPosition: string;
  lapSet: string;
  time: string;
}

type props = {
  fastestLapData: FastestLapDataProps[];
  screenWidth: number;
};

export function FantasyPropsFastestLapWidget({
  fastestLapData,
  screenWidth,
}: props) {
  // { fastestLaps }: fastestLaps // ergast api
  const gridNameWidth = screenWidth <= 450 ? 105 : 168;
  const gridChoiceWidth = screenWidth <= 450 ? 145 : 150;
  const gridPlacingWidth = screenWidth <= 450 ? 93 : 120;
  const gridMobileWidth = screenWidth <= 450 ? screenWidth - 36 : 440;
  const gridPlacingName = screenWidth <= 450 ? "Pos." : "Placing";
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Name",
      field: "name",
      width: gridNameWidth,
    },
    {
      headerName: "Choice",
      field: "propBetsMostFastestLaps",
      width: gridChoiceWidth,
    },
    {
      headerName: gridPlacingName,
      field: "numberOfFastestLaps",
      cellClass: "my-class",
      width: gridPlacingWidth,
      sort: "desc" as any,
    },
  ]);

  useEffect(() => {
    const fastestLapsByRoundUpdated = fastestLapData.map((race) => {
      if (race === undefined) return;
      return race.driverName;
    });

    const fastestLapCountByDriver = fastestLapsByRoundUpdated.reduce<{
      [key: string]: number;
    }>((acc, curr) => {
      if (curr === undefined) return acc;
      else {
        if (curr in acc) {
          acc[curr]++;
        } else {
          acc[curr] = 1;
        }
        return acc;
      }
    }, {});

    const sortedDriverResults = Object.entries(fastestLapCountByDriver)
      .map(([driver, count]) => ({ driver, count }))
      .sort((a, b) => b.count - a.count);

    const propBetTable = fantasy.map((value) => {
      let propBetsMostFastestLaps = value.propBets.mostFastestLaps;
      let thing = sortedDriverResults.find(
        (v: any) => v.driver === propBetsMostFastestLaps
      );
      if (thing?.count === undefined)
        return {
          name: value.name,
          nickName: value.nickName,
          propBetsMostFastestLaps: propBetsMostFastestLaps,
          numberOfFastestLaps: 0 as number,
        };
      return {
        name: value.name,
        nickName: value.nickName,
        propBetsMostFastestLaps: propBetsMostFastestLaps,
        numberOfFastestLaps: thing?.count as number,
      };
    });
    setRowData(propBetTable as any);

    // const fastestLapsByRoundUpdated = fastestLaps.map((race) => {
    //   if (race === undefined) return;
    //   const driverTest = race.fastestLaps[0].Driver;
    //   return {
    //     driver: driverTest.givenName + " " + driverTest.familyName,
    //   };
    // });

    // const fastestLapCountByDriver = fastestLapsByRoundUpdated.reduce<{
    //   [key: string]: number;
    // }>((acc, curr) => {
    //   if (curr === undefined) return acc;
    //   else {
    //     if (curr.driver in acc) {
    //       acc[curr.driver]++;
    //     } else {
    //       acc[curr.driver] = 1;
    //     }
    //     return acc;
    //   }
    // }, {});
    // const sortedDriverResults = Object.entries(fastestLapCountByDriver)
    //   .map(([driver, count]) => ({ driver, count }))
    //   .sort((a, b) => b.count - a.count);

    // const propBetTable = fantasy.map((value) => {
    //   let propBetsMostFastestLaps = value.propBets.mostFastestLaps;

    //   let thing = sortedDriverResults.find(
    //     (v: any) => v.driver === propBetsMostFastestLaps
    //   );
    //   if (thing?.count === undefined)
    //     return {
    //       name: value.name,
    //       nickName: value.nickName,
    //       propBetsMostFastestLaps: propBetsMostFastestLaps,
    //       numberOfFastestLaps: 0 as number,
    //     };
    //   return {
    //     name: value.name,
    //     nickName: value.nickName,
    //     propBetsMostFastestLaps: propBetsMostFastestLaps,
    //     numberOfFastestLaps: thing?.count as number,
    //   };
    // });
    // setRowData(propBetTable as any);
  }, [fastestLapData]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      suppressMovable: true,
    }),
    []
  );

  return (
    <div
      className={`border-gray-300 border-2 ${
        screenWidth <= 450
          ? "prop-bet-mobile rounded-xl py-2"
          : "rounded-2xl p-2"
      }`}
    >
      <h3
        className={`text-xl font-bold ${screenWidth <= 450 ? "pl-4" : "p-2"}`}
      >
        DHL™ Fastest Lap (Driver)
      </h3>
      <div
        className={screenWidth <= 450 ? "ag-theme-f1-mobile" : "ag-theme-f1"}
        style={{ height: "265px", width: gridMobileWidth }}
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
