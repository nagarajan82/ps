import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../index.css";
import trackInfo from "../../data/trackInfo.json";
import { RaceResultsDetailedWidget } from "./RaceResultsDetailedWidget";
import { RaceStandings } from "../../components/CurrentSeason/RaceStandings";

type RaceResultsWidgetProps = {
  raceResults: UpdatedRacesResults[];
  qualiResults: QualiResults[];
  sprintResults: sprintResultsProp[];
  screenWidth: number;
  raceSchedule: RaceSchedule[];
};
type sprintResultsProp = {
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
  SprintResults: [
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
type UpdatedRacesResults = {
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
  // localRaceDateTime: string;
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

export function RaceResultsWidget({
  raceResults,
  qualiResults,
  sprintResults,
  screenWidth,
  raceSchedule,
}: RaceResultsWidgetProps) {
  const [raceResultsByCircuit, setRaceResultsByCircuit] =
    useState<UpdatedRacesResults[]>(raceResults);
  const lastRound = raceResultsByCircuit.length - 1;

  const [selectedCircuit, setSelectedCircuit] = useState(
    raceResults[lastRound]
  );
  const slider = useRef<Slider>(null);
  // const initSlide = Number(lastRound);
  const [isListOpen, setIsListOpen] = useState(false);

  const handleRaceClick = (race: any) => {
    setSelectedCircuit(race as UpdatedRacesResults);
  };

  const reloadSlider = (race: any) => {
    setSelectedCircuit(race as UpdatedRacesResults);
    slider.current?.slickGoTo(race.round - 1);
  };

  const handleRaceClickMobile = (race: any) => {
    setSelectedCircuit(race as UpdatedRacesResults);
    reloadSlider(race as UpdatedRacesResults);
    setIsListOpen(!isListOpen);
  };

  useEffect(() => {
    setRaceResultsByCircuit(raceResults);
    reloadSlider(raceResults[lastRound]);
  }, [raceResults, slider]);

  const settingsMobile = {
    infinite: false,
    swipeToSlide: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  // console.log(selectedCircuit);
  return (
    <div className="flex flex-col race-schedule--main-container-mobile">
      <div className="">
        <button
          className="race-schedule--btn-mobile mb-4 rounded-lg w-full"
          onClick={() => setIsListOpen(!isListOpen)}
        >
          {isListOpen ? "See Slider View" : "See List View"}
        </button>
        <div
          className={
            isListOpen ? "hidden" : "relative flex justify-center w-full"
          }
        >
          <Slider
            ref={slider}
            className="slider-container w-3/5"
            {...settingsMobile}
          >
            {raceResultsByCircuit.map((race: any) => (
              <button
                key={race.round}
                className={`relative circuit-info--button text-left px-1 py-2 rounded-lg ${
                  race.round === selectedCircuit.round ? "selected" : ""
                }`}
                onClick={() => handleRaceClick(race)}
              >
                <div className="flex items-center">
                  <img
                    className="rounded-lg w-[60px] h-[36px] mr-2 ml-1"
                    src={race.additionalInfo?.flagUrl}
                    alt={race.additionalInfo?.circuitName}
                  />
                  <div className="flex flex-col">
                    <div
                      className={`text-sm leading-4 ${
                        race.round === selectedCircuit.round ? "text-white" : ""
                      }`}
                    >
                      {new Date(race.date + "T" + race.time).toLocaleString(
                        "en-US",
                        {
                          day: "2-digit",
                        }
                      )}{" "}
                      {new Date(race.date + "T" + race.time)
                        .toLocaleString("en-US", {
                          month: "short",
                        })
                        .toUpperCase()}
                    </div>
                    <div
                      className={`text-md mt-1 leading-4 font-bold ${
                        race.round === selectedCircuit.round
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      {race.additionalInfo?.Location.country}
                    </div>
                  </div>
                </div>
                {race.round === raceResults[raceResults.length - 1].round ? (
                  <div className="absolute top-1 right-1 race-schedule--next-tag">
                    PREVIOUS
                  </div>
                ) : (
                  ""
                )}
              </button>
            ))}
          </Slider>
        </div>
        <div
          className={isListOpen ? "flex flex-wrap gap-2 w-full mb-4" : "hidden"}
        >
          {raceResultsByCircuit.map((race: any) => (
            <button
              key={race.round}
              className={`relative w-full circuit-info--button text-left rounded-lg ${
                race.round === selectedCircuit.round ? "selected" : ""
              }`}
              onClick={() => handleRaceClickMobile(race)}
            >
              <div className="flex items-center justify-between py-1 px-2">
                <img
                  className="rounded-md w-10 h-7 border-2 border-black"
                  src={race.additionalInfo?.flagUrl}
                  alt={race.additionalInfo?.circuitName}
                />
                <div
                  className={`text-base w-32 leading-4 font-bold ${
                    race.round === selectedCircuit.round
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  {race.additionalInfo?.Location.country}
                </div>
                <div
                  className={`text-base w-16 leading-4 ${
                    race.round === selectedCircuit.round ? "text-white" : ""
                  }`}
                >
                  {new Date(race.date + "T" + race.time).toLocaleString(
                    "en-US",
                    {
                      day: "2-digit",
                    }
                  )}{" "}
                  {new Date(race.date + "T" + race.time)
                    .toLocaleString("en-US", {
                      month: "short",
                    })
                    .toUpperCase()}
                </div>
              </div>
              {race.round === lastRound ? (
                <div className="absolute right-24 top-0 bottom-0 flex ">
                  <p className="self-center race-schedule--next-tag">NEXT</p>
                </div>
              ) : (
                ""
              )}
            </button>
          ))}
        </div>
      </div>
      {selectedCircuit && (
        <RaceStandings
          sprintResults={sprintResults as any}
          raceResults={raceResults as any}
          raceSchedule={raceSchedule as any}
          qualiStandings={qualiResults as any}
          screenWidth={screenWidth}
          activeRace={selectedCircuit.circuitId}
        />
      )}
    </div>
  );
}
