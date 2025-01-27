import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../index.css";
import trackInfo from "../../data/trackInfo.json";
import { CircuitDetailedWidget } from "./CircuitDetailedWidget";
import { CircuitDetailedWidgetMobile } from "./CircuitDetailedWidgetMobile";

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
};

type RaceScheduleWidgetProps = {
  raceSchedule: RaceSchedule[];
  recentRacesResults: RecentRacesResults[];
  recentPoleWinners: RecentPoleWinners[];
  screenWidth: number;
};

type RecentRacesResults = {
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
};

type RecentPoleWinners = {
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

type UpdatedSchedule = {
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
  localRaceDateTime: string;
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

export function RaceScheduleWidgetMobile({
  raceSchedule,
  recentRacesResults,
  recentPoleWinners,
  screenWidth,
}: RaceScheduleWidgetProps) {
  const truncatedRaceSchedule = raceSchedule.map((value: any) => {
    return {
      ...value,
      circuitId: value.Circuit.circuitId,
    };
  });

  const updatedRaceSchedule = truncatedRaceSchedule.map((value) => {
    const additionalInfo = trackInfo.find(
      (race) => race.circuitId === value.Circuit.circuitId
    );

    const previousRaceInfo = recentRacesResults.find(
      (race) => race?.Circuit.circuitId === value.Circuit.circuitId
    );

    const previousPoleWinner = recentPoleWinners.find(
      (race) => race?.Circuit.circuitId === value.Circuit.circuitId
    );

    return {
      ...value,
      additionalInfo,
      previousRaceInfo: {
        season: previousRaceInfo?.season || null,
        raceResults: previousRaceInfo?.Results[0] || null,
      },
      previousPoleWinner: {
        season: previousPoleWinner?.season || null,
        qualifyingResults: previousPoleWinner?.QualifyingResults[0] || null,
      },
      localRaceDateTime: getLocalTime(
        value.date,
        value.time,
        Number(additionalInfo?.Location.gmtOffset)
      ),
    };
  });

  const currentDate = new Date();

  // Filter races with date greater than current date
  const futureRaces = updatedRaceSchedule.filter((race: any) => {
    const raceDate = new Date(race.date + "T" + race.time);
    return raceDate > currentDate;
  });

  // Sort future races by round (ascending order)
  futureRaces.sort((a: any, b: any) => a.round - b.round);
  // Next race will be the first race in the sorted array

  const previousRaces = updatedRaceSchedule.filter((race: any) => {
    const raceDate = new Date(race.date + "T" + race.time);
    return raceDate < currentDate;
  });
  // Sort previous races by round (ascending order)
  previousRaces.sort((a: any, b: any) => b.round - a.round);

  const previousRace = previousRaces[0];
  const [selectedCircuit, setSelectedCircuit] = useState(futureRaces[0]);

  function getLocalTime(date: string, time: string, offset: number) {
    // need to add the mins, etc back on
    const mainHour = Number(time.split(":")[0]);
    let result = mainHour + offset;
    const timeArr = time.split(":");
    if (result < 0) {
      result = 24 + result;
      const updatedTime =
        result + ":" + time.split(":")[1] + ":" + time.split(":")[2];
      const updatedDateDay = (date.slice(8) as any) - 1;
      const updatedDate = date.slice(0, 8) + updatedDateDay;
      return updatedDate + "T" + updatedTime;
    }
    const updatedTime =
      result + ":" + time.split(":")[1] + ":" + time.split(":")[2];

    return date + "T" + updatedTime;
  }

  const slider = useRef<Slider>(null);
  const initSlide = Number(previousRace.round);
  const [isListOpen, setIsListOpen] = useState(false);

  const handleRaceClick = (race: any) => {
    setSelectedCircuit(race as UpdatedSchedule);
  };

  const handleRaceClickMobile = (race: any) => {
    setSelectedCircuit(race as UpdatedSchedule);
    reloadSlider(race);
    setIsListOpen(!isListOpen);
  };

  const reloadSlider = (race: any) => {
    setSelectedCircuit(race as UpdatedSchedule);
    slider.current?.slickGoTo(race.round - 1);
  };

  const settings = {
    infinite: false,
    swipeToSlide: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    reloadSlider(futureRaces[0]);
  }, [slider]);

  return (
    <div className="flex flex-col race-schedule--main-container-mobile">
      <button
        className="race-schedule--btn-mobile mb-4 rounded-lg"
        onClick={() => setIsListOpen(!isListOpen)}
      >
        {isListOpen ? "See Slider View" : "See List View"}
      </button>
      <div
        className={
          isListOpen ? "hidden" : "relative flex w-full justify-center mb-4"
        }
      >
        <Slider ref={slider} className="slider-container w-3/5" {...settings}>
          {updatedRaceSchedule.map((race: any) => (
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
                  src={race.additionalInfo.flagUrl}
                  alt={race.additionalInfo.circuitName}
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
                    {race.additionalInfo.Location.country}
                  </div>
                </div>
              </div>
              {race.round === futureRaces[0].round ? (
                <div className="absolute top-1 right-1 race-schedule--next-tag">
                  NEXT
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
        {updatedRaceSchedule.map((race: any) => (
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
                src={race.additionalInfo.flagUrl}
                alt={race.additionalInfo.circuitName}
              />
              <div
                className={`text-base w-32 leading-4 font-bold ${
                  race.round === selectedCircuit.round
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                {race.additionalInfo.Location.country}
              </div>
              <div
                className={`text-base w-16 leading-4 ${
                  race.round === selectedCircuit.round ? "text-white" : ""
                }`}
              >
                {new Date(race.date + "T" + race.time).toLocaleString("en-US", {
                  day: "2-digit",
                })}{" "}
                {new Date(race.date + "T" + race.time)
                  .toLocaleString("en-US", {
                    month: "short",
                  })
                  .toUpperCase()}
              </div>
            </div>
            {race.round === futureRaces[0].round ? (
              <div className="absolute right-24 top-0 bottom-0 flex ">
                <p className="self-center race-schedule--next-tag">NEXT</p>
              </div>
            ) : (
              ""
            )}
          </button>
        ))}
      </div>
      {selectedCircuit && (
        <CircuitDetailedWidgetMobile
          circuit={selectedCircuit}
          raceSchedule={updatedRaceSchedule}
          key={selectedCircuit.round} // Add key prop to force re-render
        />
      )}
    </div>
  );
}
