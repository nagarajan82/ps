import { useEffect, useRef, useState } from "react";
import { RaceResultsDriverWidget } from "./RaceResultsDriverWidget";
import { RaceResultsFastestLapsWidget } from "./RaceResultsFastestLapsWidget";
import { RaceResultsQualifyingWidget } from "./RaceResultsQualifyingWidget";
import { RaceResultsStartingGridWidget } from "./RaceResultsStartingGridWidget";

type RacesResultsProps = {
  season: string;
  round: string;
  url: string;
  raceName: string;
  circuitId: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  date: string;
  time: string;
  localRaceDateTime: string;
  Results: [
    {
      number: string;
      position: string;
      positionText: string;
      points: string;
      Driver: {
        driverId: string;
        permanentNumber: string;
        code: string;
        url: string;
        givenName: string;
        familyName: string;
        dateOfBirth: string;
        nationality: string;
      };
      Constructor: {
        constructorId: string;
        url: string;
        name: string;
        nationality: string;
      };
      grid: string;
      laps: string;
      status: string;
      Time: {
        millis: string;
        time: string;
      };
      FastestLap: {
        rank: string;
        lap: string;
        Time: {
          time: string;
        };
        AverageSpeed: {
          units: string;
          speed: string;
        };
      };
    }
  ];
  additionalInfo: {
    circuitId: string;
    imgUrl: string;
    heroImgUrl: string;
    flagUrl: string;
    url: string;
    circuitUrl: string;
    circuitName: string;
    laps: string;
    circuitLength: string;
    raceLength: string;
    firstGrandPrix: string;
    lapRecord: {
      time: string;
      driver: string;
      year: string;
    };
    qualiRecord: {
      time: string;
      driver: string;
      year: string;
    };
    numberOfTimesHeld: string;
    mostDriverWins: string;
    mostConstructorWins: string;
    trackType: string;
    trackComments: string;
    grandPrixComments: {
      1: string;
      2: string;
      3: string;
    };
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
      timezone: string;
      gmtOffset: string;
    };
  };
};

type QualiResults = {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  date: string;
  time: string;
  QualifyingResults: [
    {
      number: string;
      position: string;
      Driver: {
        driverId: string;
        code: string;
        url: string;
        givenName: string;
        familyName: string;
        dateOfBirth: string;
        nationality: string;
      };
      Constructor: {
        constructorId: string;
        url: string;
        name: string;
        nationality: string;
      };
      Q1: string;
      Q2: string;
      Q3: string;
    }
  ];
};

type CircuitInfo = {
  raceName: string;
  date: string;
  time: string;
  round: string;
  circuitId: string;
};

type RaceResultsDetailedWidgetProps = {
  raceResults: RacesResultsProps[];
  qualiResults: QualiResults[];
  circuit: CircuitInfo;
  screenWidth: number;
};

export function RaceResultsDetailedWidget({
  circuit,
  raceResults,
  qualiResults,
  screenWidth,
}: RaceResultsDetailedWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLHeadingElement>(null);

  const [selectedRace, setSelectedRace] = useState<RacesResultsProps | null>(
    null
  );
  const [selectedQuali, setSelectedQuali] = useState<QualiResults | null>(null);
  const [activeWidget, setActiveWidget] = useState("result");
  const [seeAllActive, setSeeAllActive] = useState(true);
  const [isRaceNameSticky, setIsRaceNameSticky] = useState(false);

  useEffect(() => {
    const race = raceResults.find(
      (object) => object.circuitId === circuit.circuitId
    );
    const quali = qualiResults.find(
      (object) => object.Circuit.circuitId === circuit.circuitId
    );
    setSelectedRace(race as RacesResultsProps);
    setSelectedQuali(quali as QualiResults);
  }, [raceResults]);

  useEffect(() => {
    const handleScroll = () => {
      const div = mainContentRef.current;
      if (div) {
        if (div.getBoundingClientRect().top <= 130) {
          setIsRaceNameSticky(true);
        } else {
          setIsRaceNameSticky(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!selectedRace || !selectedQuali) {
    return null; // no next race found
  }

  const seeAllFunction = () => {
    setActiveWidget("result");
    setSeeAllActive(!seeAllActive);
  };

  return (
    <div className="">
      {screenWidth <= 450 ? (
        <div className="">
          <div className="flex justify-between">
            <div className="flex flex-col ml-2">
              <h1 className="text-md font-bold">
                {selectedRace.Circuit.circuitName}
              </h1>
              <h3 className="text-sm">
                {selectedRace.Circuit.Location.locality}
              </h3>
            </div>
            <div className="">
              <button
                className={`w-32 px-2 py-1 border-2 rounded-lg hover:bg-gray-100 ${
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
                activeWidget === "result"
                  ? "bg-black text-white border-black hover:bg-gray-800"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveWidget("result")}
            >
              RACE
            </button>
            <button
              className={`px-2 py-1 flex-1 border-2 rounded-lg hover:bg-gray-100 ${
                activeWidget === "grid"
                  ? "bg-black text-white border-black hover:bg-gray-800"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveWidget("grid")}
            >
              GRID
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
                activeWidget === "pits"
                  ? "bg-black text-white border-black hover:bg-gray-800"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveWidget("pits")}
            >
              PITS
            </button>
            <button
              className={`px-2 py-1 flex-1 border-2 rounded-lg hover:bg-gray-100 ${
                activeWidget === "qualifying"
                  ? "bg-black text-white border-black hover:bg-gray-800"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveWidget("qualifying")}
            >
              QUAL
            </button>
            <button
              className={`px-2 py-1 flex-1 border-2 rounded-lg hover:bg-gray-100 ${
                activeWidget === "p1"
                  ? "bg-black text-white border-black hover:bg-gray-800"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveWidget("p1")}
            >
              P1
            </button>
            <button
              className={`px-2 py-1 flex-1 border-2 rounded-lg hover:bg-gray-100 ${
                activeWidget === "p2"
                  ? "bg-black text-white border-black hover:bg-gray-800"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveWidget("p2")}
            >
              P2
            </button>
            <button
              className={`px-2 py-1 flex-1 border-2 rounded-lg hover:bg-gray-100 ${
                activeWidget === "p3"
                  ? "bg-black text-white border-black hover:bg-gray-800"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveWidget("p3")}
            >
              P3
            </button>
          </div>
          <div className="flex flex-wrap gap-6">
            <div
              className={
                seeAllActive
                  ? "block"
                  : activeWidget === "result"
                  ? "block"
                  : "hidden"
              }
            >
              <RaceResultsDriverWidget
                raceResult={selectedRace}
                screenWidth={screenWidth}
              />
            </div>
            <div
              className={
                seeAllActive
                  ? "block"
                  : activeWidget === "grid"
                  ? "block"
                  : "hidden"
              }
            >
              {/* NEED BOTH QUALI (time) AND RACERESULT (grid #) */}
              <RaceResultsStartingGridWidget
                raceResult={selectedRace}
                qualiResult={selectedQuali}
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
            >
              <RaceResultsFastestLapsWidget
                raceResult={selectedRace}
                screenWidth={screenWidth}
              />
            </div>
            <div
              className={
                seeAllActive
                  ? "block"
                  : activeWidget === "qualifying"
                  ? "block"
                  : "hidden"
              }
            >
              <RaceResultsQualifyingWidget
                qualiResult={selectedQuali}
                screenWidth={screenWidth}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-10">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="flex flex-col ml-2">
                <h1 className="text-md font-bold">
                  {selectedRace.Circuit.circuitName}
                </h1>
                <h3 className="text-sm">
                  {selectedRace.Circuit.Location.locality}
                </h3>
              </div>
              <div className="">
                <button
                  className={`w-32 px-2 py-1 border-2 rounded-lg hover:bg-gray-100 ${
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
                  activeWidget === "result"
                    ? "bg-black text-white border-black hover:bg-gray-800"
                    : "border-gray-300"
                }`}
                onClick={() => setActiveWidget("result")}
              >
                RACE
              </button>
              <button
                className={`px-2 py-1 flex-1 border-2 rounded-lg hover:bg-gray-100 ${
                  activeWidget === "grid"
                    ? "bg-black text-white border-black hover:bg-gray-800"
                    : "border-gray-300"
                }`}
                onClick={() => setActiveWidget("grid")}
              >
                GRID
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
                  activeWidget === "pits"
                    ? "bg-black text-white border-black hover:bg-gray-800"
                    : "border-gray-300"
                }`}
                onClick={() => setActiveWidget("pits")}
              >
                PITS
              </button>
              <button
                className={`px-2 py-1 flex-1 border-2 rounded-lg hover:bg-gray-100 ${
                  activeWidget === "qualifying"
                    ? "bg-black text-white border-black hover:bg-gray-800"
                    : "border-gray-300"
                }`}
                onClick={() => setActiveWidget("qualifying")}
              >
                QUAL
              </button>
              <button
                className={`px-2 py-1 flex-1 border-2 rounded-lg hover:bg-gray-100 ${
                  activeWidget === "p1"
                    ? "bg-black text-white border-black hover:bg-gray-800"
                    : "border-gray-300"
                }`}
                onClick={() => setActiveWidget("p1")}
              >
                P1
              </button>
              <button
                className={`px-2 py-1 flex-1 border-2 rounded-lg hover:bg-gray-100 ${
                  activeWidget === "p2"
                    ? "bg-black text-white border-black hover:bg-gray-800"
                    : "border-gray-300"
                }`}
                onClick={() => setActiveWidget("p2")}
              >
                P2
              </button>
              <button
                className={`px-2 py-1 flex-1 border-2 rounded-lg hover:bg-gray-100 ${
                  activeWidget === "p3"
                    ? "bg-black text-white border-black hover:bg-gray-800"
                    : "border-gray-300"
                }`}
                onClick={() => setActiveWidget("p3")}
              >
                P3
              </button>
            </div>
            <div className="flex flex-wrap gap-6">
              <div
                className={
                  seeAllActive
                    ? "block"
                    : activeWidget === "result"
                    ? "block"
                    : "hidden"
                }
              >
                <RaceResultsDriverWidget
                  raceResult={selectedRace}
                  screenWidth={screenWidth}
                />
              </div>
              <div
                className={
                  seeAllActive
                    ? "block"
                    : activeWidget === "grid"
                    ? "block"
                    : "hidden"
                }
              >
                {/* NEED BOTH QUALI (time) AND RACERESULT (grid #) */}
                <RaceResultsStartingGridWidget
                  raceResult={selectedRace}
                  qualiResult={selectedQuali}
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
              >
                <RaceResultsFastestLapsWidget
                  raceResult={selectedRace}
                  screenWidth={screenWidth}
                />
              </div>
              <div
                className={
                  seeAllActive
                    ? "block"
                    : activeWidget === "qualifying"
                    ? "block"
                    : "hidden"
                }
              >
                <RaceResultsQualifyingWidget
                  qualiResult={selectedQuali}
                  screenWidth={screenWidth}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
