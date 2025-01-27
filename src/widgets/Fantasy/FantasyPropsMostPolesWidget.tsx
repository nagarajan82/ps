import { useEffect, useMemo, useState } from "react";
import fantasy from "../../data/fantasy.json";
import driver from "../../data/driver.json";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface QualiStandingsProps {
  season: number;
  round: number;
  url: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: number;
      long: number;
      locality: string;
      country: string;
    };
  };
  date: Date;
  time: number;
  QualifyingResults: [
    {
      number: number;
      position: number;
      Driver: {
        driverId: string;
        permanentNumber: number;
        code: string;
        url: string;
        givenName: string;
        familyName: string;
        dateOfBirth: Date;
        nationality: string;
      };
      Constructor: {
        constructorId: string;
        url: string;
        name: string;
        nationality: string;
      };
      Q1: number;
      Q2: number;
      Q3: number;
    }
  ];
}

type props = {
  qualiStandings: QualiStandingsProps[];
  screenWidth: number;
};

interface driverTableProps {
  driverId: string;
  name: string;
  numberOfPoles: number;
}

const driverTable: driverTableProps[] = driver.map((value) => {
  return {
    name: value.name,
    driverId: value.driverId,
    numberOfPoles: 0,
  };
});

export function FantasyPropsMostPolesWidget({
  qualiStandings,
  screenWidth,
}: props) {
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
      field: "propBetsMostPoles",
      width: gridChoiceWidth,
    },
    {
      headerName: gridPlacingName,
      field: "totalPoles",
      cellClass: "my-class",
      width: gridPlacingWidth,
      sort: "desc" as string,
    },
  ]);

  useEffect(() => {
    // create a copy of the driver table array with the numberOfPoles property set to 0
    const drivers = driver.map((value) => {
      return {
        name: value.name,
        driverId: value.driverId,
        numberOfPoles: 0,
      };
    });

    // iterate over each race in the qualiStandings array
    qualiStandings.forEach((race) => {
      // iterate over each QualifyingResult in this race
      race.QualifyingResults.forEach((result) => {
        // find the driver in the drivers array that matches the driverId of this QualifyingResult
        const driverIndex = drivers.findIndex(
          (driver) => driver.driverId === result.Driver.driverId
        );

        // if the driver is found, increment their numberOfPoles property
        if (driverIndex !== -1) {
          drivers[driverIndex].numberOfPoles += 1;
        }
      });
    });

    // create a new array with the driver information and their total number of poles

    const newPlayerArray = fantasy.map((value) => {
      let propBetsMostPoles = value.propBets.mostPoles;
      let thing = drivers.find((v: any) => v.name === propBetsMostPoles);
      return {
        name: value.name,
        nickName: value.nickName,
        propBetsMostPoles: propBetsMostPoles,
        totalPoles: thing?.numberOfPoles,
      };
    });

    setRowData(newPlayerArray as any);
  }, []);

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
        Pirelli™ Pole (Driver)
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
