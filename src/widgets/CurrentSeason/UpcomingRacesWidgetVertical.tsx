import { useMemo, useState } from "react";
import { CircuitDetailedWidget } from "./CircuitDetailedWidget";

type RaceSchedule = {
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
  date: string;
  time: string;
  FirstPractice: {
    date: string;
    time: string;
  };
  SecondPractice: {
    date: string;
    time: string;
  };
  ThirdPractice: {
    date: string;
    time: string;
  };
  Qualifying: {
    date: string;
    time: string;
  };
  Sprint: {
    date: string;
    time: string;
  };
};

type UpcomingRacesWidgetProps = {
  raceSchedule: RaceSchedule[];
};

export function UpcomingRacesWidgetVertical({
  raceSchedule,
}: UpcomingRacesWidgetProps) {
  const truncatedRaceSchedule = raceSchedule.map((value: any) => {
    return {
      raceName: value["raceName"],
      date: value["date"],
      time: value["time"],
      round: value["round"],
      circuitId: value.Circuit.circuitId,
    };
  });

  const currentDate = new Date();
  // Filter races with date greater than current date
  const futureRaces = useMemo(() => {
    return truncatedRaceSchedule
      .filter((race: any) => {
        const raceDate = new Date(race.date + "T" + race.time);
        return raceDate > currentDate;
      })
      .sort((a: any, b: any) => a.round - b.round);
  }, [truncatedRaceSchedule, currentDate]);
  //need to make an onclick button state var for the selected race with at least the circuitId

  const previousRaces = truncatedRaceSchedule.filter((race: any) => {
    const raceDate = new Date(race.date + "T" + race.time);
    return raceDate < currentDate;
  });

  // Sort previous races by round (ascending order)
  previousRaces.sort((a: any, b: any) => b.round - a.round);

  const previousRace = previousRaces[0];
  const [selectedCircuit, setSelectedCircuit] = useState(futureRaces[0]);

  const handleRaceClick = (race: any) => {
    setSelectedCircuit(race);
  };

  return (
    <div className="">
      <div className="p-2">
        {/* <h3 className="p-2 font-bold">Race Schedule</h3> */}
        <div className="flex p-2">
          {truncatedRaceSchedule.map(
            (race: any) =>
              selectedCircuit && (
                <button
                  key={race.round}
                  className={`relative text-left p-2 mr-2 rounded-2xl w-64 border-gray-300 border-2 ${
                    race.round === selectedCircuit.round ? "bg-black first" : ""
                  }`}
                  onClick={() => handleRaceClick(race)}
                >
                  <div
                    className={`text-gray-500 text-xs ${
                      race.round === selectedCircuit.round
                        ? "text-white first"
                        : ""
                    }`}
                  >{`Round ${race.round}`}</div>
                  <div
                    className={` ${
                      race.round === selectedCircuit.round
                        ? "text-white font-bold first"
                        : "text-gray-800"
                    }`}
                  >
                    {race.raceName}
                  </div>
                  <div
                    className={`text-gray-500 text-xs ${
                      race.round === selectedCircuit.round
                        ? "text-white first"
                        : ""
                    }`}
                  >
                    {new Date(race.date + "T" + race.time)
                      .toLocaleString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })
                      .replace(/,/, " at")}
                  </div>
                  {race.round === futureRaces[0].round ? (
                    <div className="absolute top-[5px] right-[5px]">
                      <p className="text-red-600 px-1 py-[2px] font-bold bg-neutral-200 rounded-lg text-xs">
                        NEXT
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                  {race.round === previousRace.round ? (
                    <div className="absolute top-[5px] right-[5px]">
                      <p className="text-black px-1 py-[2px] font-bold bg-neutral-200 rounded-lg text-xs">
                        PREVIOUS
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </button>
              )
          )}
        </div>
      </div>
      {/* showing the detailed track Info */}
      <div>
        {selectedCircuit && (
          <CircuitDetailedWidget
            circuit={selectedCircuit}
            raceSchedule={raceSchedule as any}
            key={selectedCircuit.round} // Add key prop to force re-render
          />
        )}
      </div>
    </div>
  );
}
