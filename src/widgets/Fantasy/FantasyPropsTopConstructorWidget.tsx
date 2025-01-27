import { useEffect, useMemo, useState } from "react";
import fantasy from "../../data/fantasy.json";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

type ConstructorStandings = {
  constructorStandings: {
    position: number;
    positionText: string;
    points: number;
    wins: number;
    Constructor: {
      constructorId: string;
      url: string;
      name: string;
      nationality: string;
    };
  };
};

type props = {
  constructorStandings: ConstructorStandings;
  screenWidth: number;
};

export function FantasyPropsTopConstructorWidget({
  constructorStandings,
  screenWidth,
}: props) {
  const gridNameWidth = screenWidth <= 450 ? 120 : 168;
  const gridChoiceWidth = screenWidth <= 450 ? 130 : 150;
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
      field: "propBetsTopConstructor",
      width: gridChoiceWidth,
    },
    {
      headerName: gridPlacingName,
      field: "currentConstructorPosition",
      cellClass: "my-class",
      width: gridPlacingWidth,
      sort: "asc" as string,
    },
  ]);

  if (constructorStandings instanceof Array) {
    const constructorInfo = constructorStandings.map((value: any) => {
      return {
        constructor: value.Constructor.name,
        position: value.position,
      };
    });

    const newPlayerArray = fantasy.map((value) => {
      let propBetsTopConstructor = value.propBets.topConstructor;
      let thing = constructorInfo.find(
        (v: any) => v.constructor === propBetsTopConstructor
      );
      return {
        name: value.name,
        nickName: value.nickName,
        propBetsTopConstructor: propBetsTopConstructor,
        currentConstructorPosition: thing?.position,
      };
    });

    useEffect(() => setRowData(newPlayerArray as any), []);
    //   console.log(constructorStandings, newPlayerArray);
  }
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
        Top Constructor
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
