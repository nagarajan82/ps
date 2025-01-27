import { useEffect, useMemo, useState } from "react";
import fantasy from "../../data/fantasy.json";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type DriverProps = {
  driverData: [];
};

type newPlayerArrayType = {
  id: number;
  name: string;
  nickName: string;
  totalPoints: number;
  drivers: {
    driverName: string;
    driverCode: string;
    driverPoints: number;
  };
};

export function FantasyMainScoreboardWidgetMobile({ driverData }: DriverProps) {
  const newDriverArray = driverData.map((value) => {
    return {
      code: value["Driver"]["code"] as string,
      points: value["points"] as number,
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
        id: value.id,
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

  const [players, setPlayers] = useState(
    newPlayerArray.map((player) => ({ ...player, isOpen: false }))
  );

  return (
    <div className="fantasy-main-scoreboard-mobile flex flex-col rounded-lg">
      {players.map((player, index) => (
        <button
          className={`fantasy-main-scoreboard-mobile-button ${
            player.isOpen ? "active" : ""
          }`}
          key={player.id}
          onClick={() => {
            setPlayers((prevPlayers) =>
              prevPlayers.map((p, i) =>
                i === index ? { ...p, isOpen: !p.isOpen } : p
              )
            );
          }}
        >
          <div className="flex relative items-center">
            <p className="text-lg w-6 text-left ml-4">{index + 1}.</p>
            <p className="text-xl w-28 text-left">{player.name}</p>
            <p className="text-2xl font-bold ml-auto mr-2 w-28">
              {player.totalPoints}{" "}
              <span className="text-sm font-normal">pts</span>
            </p>
            <FontAwesomeIcon
              icon={player.isOpen ? "caret-up" : "caret-down"}
              className={
                player.isOpen
                  ? "absolute right-2 bottom-2"
                  : "absolute right-2 bottom-2"
              }
            />
          </div>
          {player.isOpen && (
            <div className="flex flex-col w-full">
              {player.drivers.map((x, index) => (
                <div
                  key={index}
                  className="fantasy-main-scoreboard-mobile-drivers flex ml-auto px-2 py-1 mr-7"
                >
                  <p className="w-36 text-left">{x.driverName}</p>
                  <p className="w-16 text-right">
                    {x.driverPoints}{" "}
                    <span className="text-sm font-normal">pts</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
