import { useState } from "react";

// hooks
import { getCurrentConstructorStandings } from "../../hooks/getCurrentConstructorStandings";
import { getCurrentConstructorDNFs } from "../../hooks/getCurrentConstructorDNFs";
import { getQualiResults } from "../../hooks/getQualiResults";
import { getFastestLaps } from "../../hooks/getFastestLaps";

// widgets
import { FantasyPropsBottomConstructorWidget } from "../../widgets/Fantasy/FantasyPropsBottomConstructorWidget";
import { FantasyPropsConstructorDNFsWidget } from "../../widgets/Fantasy/FantasyPropsConstructorDNFsWidget";
import { FantasyPropsTopConstructorWidget } from "../../widgets/Fantasy/FantasyPropsTopConstructorWidget";
import { FantasyPropsMostPolesWidget } from "../../widgets/Fantasy/FantasyPropsMostPolesWidget";
import { FantasyPropsFastestLapWidget } from "../../widgets/Fantasy/FantasyPropsFastestLapWidget";

// data
import fantasy from "../../data/fantasy.json";
import constructors from "../../data/constructors.json";
import fastestLapData from "../../data/fastestLap.json";
import driverOfTheDay from "../../data/driverOfTheDay.json";
import { FantasyPropsDriverOfTheDayWidget } from "../../widgets/Fantasy/FantasyPropsDriverOfTheDayWidget";
type ScreenWidthProps = {
  screenWidth: number;
};
export function FantasyPropsScoreboard({ screenWidth }: ScreenWidthProps) {
  // const fastestLaps = getFastestLaps(); // ergast API
  const [activeWidget, setActiveWidget] = useState("top");
  const [seeAllActive, setSeeAllActive] = useState(true);
  const [loading, constructorStandings, error, request] =
    getCurrentConstructorStandings({
      method: "get",
      url: "https://ergast.com/api/f1/current/constructorStandings.json",
    });

  const [qualiLoading, qualiStandings] = getQualiResults({
    method: "get",
    url: "https://ergast.com/api/f1/current/qualifying/1.json",
  });
  const dnfChoice = fantasy.map((value) => {
    let playerChoice = value.propBets.mostDidNotFinish;
    let code = constructors.find((v) => v.name === playerChoice);
    if (code?.urlId)
      return {
        constructor: playerChoice,
        url: `https://ergast.com/api/f1/current/constructors/${code?.urlId}/status.json`,
      };
    return {
      constructor: playerChoice,
      url: `https://ergast.com/api/f1/current/constructors/${code?.constructorId}/status.json`,
    };
  });

  const dnfChoice1 = getCurrentConstructorDNFs({
    method: "get",
    url: dnfChoice[0].url,
  });
  const dnfChoice2 = getCurrentConstructorDNFs({
    method: "get",
    url: dnfChoice[1].url,
  });
  const dnfChoice3 = getCurrentConstructorDNFs({
    method: "get",
    url: dnfChoice[2].url,
  });
  const dnfChoice4 = getCurrentConstructorDNFs({
    method: "get",
    url: dnfChoice[3].url,
  });
  let finalDnfTable = [];
  if (
    loading ||
    dnfChoice1[0] ||
    dnfChoice2[0] ||
    dnfChoice3[0] ||
    dnfChoice4[0] ||
    qualiLoading
  ) {
    return (
      <div className="ml-2">
        <h1 className="text-2xl font-bold mb-4">Prop Bets</h1>
        <p>Loading...</p>
      </div>
    );
  }
  if (error !== "") {
    return (
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-4">Prop Bets</h1>
        <p>{error}</p>
      </div>
    );
  }
  if (!constructorStandings) {
    return (
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-4">Prop Bets</h1>
        <p>Data is null</p>
      </div>
    );
  }
  finalDnfTable.push(dnfChoice1[1]);
  finalDnfTable.push(dnfChoice2[1]);
  finalDnfTable.push(dnfChoice3[1]);
  finalDnfTable.push(dnfChoice4[1]);

  const seeAllFunction = () => {
    setActiveWidget("top");
    setSeeAllActive(!seeAllActive);
  };

  return (
    <div className="">
      {screenWidth <= 1000 ? (
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold ml-2 mb-4">Prop Bets</h1>
            <div className="self-start">
              <button
                className={`px-2 py-1 border-2 rounded-lg hover:bg-gray-100 ${
                  seeAllActive
                    ? "bg-black text-white border-black hover:bg-gray-800"
                    : "border-gray-300"
                }`}
                onClick={() => seeAllFunction()}
              >
                {seeAllActive ? "VIEW ONE" : "VIEW ALL"}
              </button>
            </div>
          </div>
          <div
            className={
              seeAllActive
                ? "hidden"
                : "flex flex-wrap items-center justify-between my-2 gap-2"
            }
          >
            <button
              className={`px-2 py-1 flex-1 border-2 rounded-lg hover:bg-gray-100 ${
                activeWidget === "top"
                  ? "bg-black text-white border-black hover:bg-gray-800"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveWidget("top")}
            >
              TOP
            </button>
            <button
              className={`px-2 py-1 flex-1 border-2 rounded-lg hover:bg-gray-100 ${
                activeWidget === "bottom"
                  ? "bg-black text-white border-black hover:bg-gray-800"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveWidget("bottom")}
            >
              BTM
            </button>
            <button
              className={`px-2 py-1 flex-1 border-2 rounded-lg hover:bg-gray-100 ${
                activeWidget === "dnfs"
                  ? "bg-black text-white border-black hover:bg-gray-800"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveWidget("dnfs")}
            >
              DNF
            </button>
            <button
              className={`px-2 py-1 flex-1 border-2 rounded-lg hover:bg-gray-100 ${
                activeWidget === "poles"
                  ? "bg-black text-white border-black hover:bg-gray-800"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveWidget("poles")}
            >
              POLE
            </button>
            <button
              className={`px-2 py-1 flex-1 border-2 rounded-lg hover:bg-gray-100 ${
                activeWidget === "fastest"
                  ? "bg-black text-white border-black hover:bg-gray-800"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveWidget("fastest")}
            >
              FAST
            </button>
            <button
              className={`px-2 py-1 flex-1 border-2 rounded-lg hover:bg-gray-100 ${
                activeWidget === "dotd"
                  ? "bg-black text-white border-black hover:bg-gray-800"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveWidget("dotd")}
            >
              DOTD
            </button>
          </div>
          <div className="flex flex-wrap gap-6">
            <div style={{ display: activeWidget === "top" ? "block" : "none" }}>
              <FantasyPropsTopConstructorWidget
                constructorStandings={constructorStandings as any}
                screenWidth={screenWidth}
              />
            </div>
            <div
              className={
                seeAllActive
                  ? "block"
                  : activeWidget === "bottom"
                  ? "block"
                  : "hidden"
              }
            >
              <FantasyPropsBottomConstructorWidget
                constructorStandings={constructorStandings as any}
                screenWidth={screenWidth}
              />
            </div>
            <div
              className={
                seeAllActive
                  ? "block"
                  : activeWidget === "dnfs"
                  ? "block"
                  : "hidden"
              }
            >
              <FantasyPropsConstructorDNFsWidget
                finalDnfTable={finalDnfTable as any}
                screenWidth={screenWidth}
              />
            </div>
            <div
              className={
                seeAllActive
                  ? "block"
                  : activeWidget === "poles"
                  ? "block"
                  : "hidden"
              }
            >
              <FantasyPropsMostPolesWidget
                qualiStandings={qualiStandings as any}
                screenWidth={screenWidth}
              />
            </div>
            <div
              className={
                seeAllActive
                  ? "block"
                  : activeWidget === "fastest"
                  ? "block"
                  : "hidden"
              }
              // style={{
              //   display: activeWidget === "fastest" ? "block" : "none",
              // }}
            >
              <FantasyPropsFastestLapWidget
                // fastestLaps={fastestLaps as any} //ergast api
                fastestLapData={fastestLapData as any}
                screenWidth={screenWidth}
              />
            </div>
            <div
              className={
                seeAllActive
                  ? "block"
                  : activeWidget === "dotd"
                  ? "block"
                  : "hidden"
              }
            >
              <FantasyPropsDriverOfTheDayWidget
                driverOfTheDay={driverOfTheDay as any}
                screenWidth={screenWidth}
              />
            </div>
          </div>
          {/* <div className="mt-2 prop-bet-widget-select-parent rounded-t-lg">
            <label htmlFor="prop-bet-widget-select"></label>
            <select
              id="prop-bet-widget-select"
              value={activeWidget}
              onChange={(event) => setActiveWidget(event.target.value)}
              className="prop-bet-widget-select w-full"
            >
              <option value="top">Top Constructor</option>
              <option value="bottom">Bottom Constructor</option>
              <option value="dnfs">Did Not Finish (Team)</option>
              <option value="poles">Pirelli Poles (Driver)</option>
              <option value="fastest">DHL Fastest Laps (Driver)</option>
              <option value="dotd">Driver of the Day</option>
            </select>
          </div> */}
        </div>
      ) : (
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-2">Prop Bets</h1>
          <div className="flex">
            {/* <div className="my-4">
          <label htmlFor="widget-select" className="mr-2 font-bold">
            Select Prop Bet:
          </label>
          <select
            id="widget-select"
            value={activeWidget}
            onChange={(event) => setActiveWidget(event.target.value)}
            className="p-2 bg-gray-200 rounded-lg hover:bg-black hover:text-white"
          >
            <option value="top">Top Constructor</option>
            <option value="bottom">Bottom Constructor</option>
            <option value="dnfs">Most DNFs (Team)</option>
            <option value="poles">Most Pirelli Poles (Driver)</option>
            <option value="fastest">Most DHL Fastest Laps (Driver)</option>
            <option value="dotd">Most Driver of the Day</option>
          </select>
        </div> */}

            <div className="flex flex-wrap">
              <div
                style={{ display: activeWidget === "top" ? "block" : "none" }}
              >
                <FantasyPropsTopConstructorWidget
                  constructorStandings={constructorStandings as any}
                  screenWidth={screenWidth}
                />
              </div>
              <div
                style={{
                  display: activeWidget === "bottom" ? "block" : "none",
                }}
              >
                <FantasyPropsBottomConstructorWidget
                  constructorStandings={constructorStandings as any}
                  screenWidth={screenWidth}
                />
              </div>
              <div
                style={{ display: activeWidget === "dnfs" ? "block" : "none" }}
              >
                <FantasyPropsConstructorDNFsWidget
                  finalDnfTable={finalDnfTable as any}
                  screenWidth={screenWidth}
                />
              </div>
              <div
                style={{ display: activeWidget === "poles" ? "block" : "none" }}
              >
                <FantasyPropsMostPolesWidget
                  qualiStandings={qualiStandings as any}
                  screenWidth={screenWidth}
                />
              </div>
              <div
                style={{
                  display: activeWidget === "fastest" ? "block" : "none",
                }}
              >
                <FantasyPropsFastestLapWidget
                  // fastestLaps={fastestLaps as any} //ergast api
                  fastestLapData={fastestLapData as any}
                  screenWidth={screenWidth}
                />
              </div>
              <div
                style={{ display: activeWidget === "dotd" ? "block" : "none" }}
              >
                <FantasyPropsDriverOfTheDayWidget
                  driverOfTheDay={driverOfTheDay as any}
                  screenWidth={screenWidth}
                />
              </div>
            </div>
            <div className="flex flex-col justify-around ml-4">
              <button
                className={`mb-1 p-2 border-2 rounded-lg hover:bg-gray-100 ${
                  activeWidget === "top"
                    ? "bg-black text-white border-black hover:bg-gray-800"
                    : "border-gray-300"
                }`}
                onClick={() => setActiveWidget("top")}
              >
                Top Constructor
              </button>
              <button
                className={`my-1 p-2 border-2 rounded-lg hover:bg-gray-100 ${
                  activeWidget === "bottom"
                    ? "bg-black text-white border-black hover:bg-gray-800"
                    : "border-gray-300"
                }`}
                onClick={() => setActiveWidget("bottom")}
              >
                Bottom Constructor
              </button>
              <button
                className={`my-1 p-2 border-2 rounded-lg hover:bg-gray-100 ${
                  activeWidget === "dnfs"
                    ? "bg-black text-white border-black hover:bg-gray-800"
                    : "border-gray-300"
                }`}
                onClick={() => setActiveWidget("dnfs")}
              >
                DNFs (Team)
              </button>
              <button
                className={`my-1 p-2 border-2 rounded-lg hover:bg-gray-100 ${
                  activeWidget === "poles"
                    ? "bg-black text-white border-black hover:bg-gray-800"
                    : "border-gray-300"
                }`}
                onClick={() => setActiveWidget("poles")}
              >
                Pirelli Poles (Driver)
              </button>
              <button
                className={`my-1 p-2 border-2 rounded-lg hover:bg-gray-100 ${
                  activeWidget === "fastest"
                    ? "bg-black text-white border-black hover:bg-gray-800"
                    : "border-gray-300"
                }`}
                onClick={() => setActiveWidget("fastest")}
              >
                DHL Fastest Laps (Driver)
              </button>
              <button
                className={`p-2 border-2 rounded-lg hover:bg-gray-100 ${
                  activeWidget === "dotd"
                    ? "bg-black text-white border-black hover:bg-gray-800"
                    : "border-gray-300"
                }`}
                onClick={() => setActiveWidget("dotd")}
              >
                Driver of the Day
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
