import { useEffect, useMemo, useState } from "react";
import fantasy from "../../data/fantasy.json";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

type DriverProps = {
  driverData: [];
};

type newPlayerArrayType = {
  name: string;
  nickName: string;
  totalPoints: number;
  drivers: {
    driverName: string;
    driverCode: string;
    driverPoints: number;
  };
};

export function FantasyMainScoreboardWidget({ driverData }: DriverProps) {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "name",
      width: 168,
      headerClass: "sub-headers-name-2" as string,
      cellClass: "cell-left-2",
    },
    {
      headerName: "Group 1" as string,
      headerClass: "ag-theme-groups-odd left-group" as string,
      children: [
        {
          headerName: "Driver" as string,
          headerClass: "sub-headers" as string,
          cellClass: "centered",
          width: 80,
          field: "drivers.0.driverCode",
        },
        {
          headerName: "Pts" as string,
          headerClass: "sub-headers" as string,
          cellClass: "centered",
          width: 80,
          field: "drivers.0.driverPoints",
          comparator: (valueA: number, valueB: number) => valueA - valueB,
        },
      ],
    },
    {
      headerName: "Group 2" as string,
      headerClass: "ag-theme-groups-even" as string,
      children: [
        {
          headerName: "Driver" as string,
          headerClass: "sub-headers" as string,
          cellClass: "centered",
          width: 80,
          field: "drivers.1.driverCode",
        },
        {
          headerName: "Pts" as string,
          headerClass: "sub-headers" as string,
          width: 80,
          cellClass: "centered",
          field: "drivers.1.driverPoints",
          comparator: (valueA: number, valueB: number) => valueA - valueB,
        },
      ],
    },
    {
      headerName: "Group 3" as string,
      headerClass: "ag-theme-groups-odd" as string,
      children: [
        {
          headerName: "Driver" as string,
          headerClass: "sub-headers" as string,
          width: 80,
          cellClass: "centered",
          field: "drivers.2.driverCode",
        },
        {
          headerName: "Pts" as string,
          headerClass: "sub-headers" as string,
          width: 80,
          cellClass: "centered",
          field: "drivers.2.driverPoints",
          comparator: (valueA: number, valueB: number) => valueA - valueB,
        },
      ],
    },
    {
      headerName: "Group 4" as string,
      headerClass: "ag-theme-groups-even right-group" as string,
      children: [
        {
          headerName: "Driver" as string,
          headerClass: "sub-headers" as string,
          width: 80,
          field: "drivers.3.driverCode",
          cellClass: "centered",
        },
        {
          headerName: "Pts" as string,
          headerClass: "sub-headers" as string,
          width: 80,
          field: "drivers.3.driverPoints",
          comparator: (valueA: number, valueB: number) => valueA - valueB,
          cellClass: "centered",
        },
      ],
    },
    {
      field: "totalPoints",
      headerName: "Total",
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      sort: "desc" as string,
      width: 100,
      headerClass: "sub-headers" as string,
      cellClass: "my-class",
    },
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      // suppressMovable: true,
    }),
    []
  );

  const newDriverArray = driverData.map((value) => {
    return {
      code: value["Driver"]["code"],
      points: value["points"],
    };
  });

  function getDriverPoints(driverCode: string) {
    // get driverID from driverInfo data based off of input
    let playerDriverPoints: number = 0;
    let points: number = 0;
    newDriverArray.find((value) => {
      if (driverCode == value.code) return (playerDriverPoints = value.points);
    });
    return +playerDriverPoints;
  }

  function sumTeamPoints(nickName: string) {
    let sum = 0;
    fantasy.filter((value) => {
      // find nickName's drivers
      if (nickName === value.nickName) {
        //return if no match
        value.mainDrivers.map((e) => {
          //iterate over drivers and add points to sum
          sum += getDriverPoints(e.code);
        });
      }
    });
    return sum;
  }

  const newPlayerArray = fantasy
    .map((value) => {
      return {
        name: value.name,
        nickName: value.nickName,
        drivers: value.mainDrivers.map((v) => {
          let thing = newDriverArray.find((t) => t.code == v.code);
          return {
            driverName: v.fullName,
            driverCode: v.code,
            driverPoints: thing?.points,
          };
        }),
        totalPoints: sumTeamPoints(value.nickName),
      };
    })
    .sort((a, b) => {
      return b.totalPoints - a.totalPoints;
    });

  useEffect(() => setRowData(newPlayerArray as any), []);

  return (
    <div className="ag-theme-f1" style={{ height: "307px", width: "910px" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs as any}
        defaultColDef={defaultColDef}
      />
    </div>
  );
}
