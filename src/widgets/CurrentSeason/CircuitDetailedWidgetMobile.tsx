import React, { useEffect, useRef, useState } from "react";
import { differenceInSeconds, parseISO } from "date-fns";
import trackInfo from "../../data/trackInfo.json";
import { ICON_MAP } from "../../utilities/Weather/iconMap";
import icons from "../../utilities/Weather/icons.json";
import { getRaceDayWeather } from "../../utilities/Weather/getWeather";

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
  previousRaceInfo: {
    season: string;
    raceResults: // check this?
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
    };
  } | null;
  previousPoleWinner: {
    season: string;
    qualifyingResults: {
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
    };
  } | null;
};

type CircuitInfo = {
  raceName: string;
  date: string;
  time: string;
  round: number;
  circuitId: string;
};

type CircuitDetailedWidgetProps = {
  raceSchedule: RaceSchedule[];
  circuit: CircuitInfo;
};

type TrackWeather = {
  current: {
    currentTemp: number;
    highTemp: number;
    lowTemp: number;
    feelsLikeHigh: number;
    feelsLikeLow: number;
    windSpeed: number;
    precip: number;
    iconCode: number;
  };
  daily: [
    {
      timestamp: number;
      iconCode: number;
      maxTemp: number;
      precipitationSum: number;
    }
  ];
  hourly: [
    {
      timestamp: number;
      iconCode: number;
      temp: number;
      feelsLike: number;
      windSpeed: number;
      precip: number;
    }
  ];
};

type WeatherIconProps = {
  weather: string;
  viewBox: string;
  d: string;
};

export function CircuitDetailedWidgetMobile({
  circuit,
  raceSchedule,
}: CircuitDetailedWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLHeadingElement>(null);

  const [selectedRace, setSelectedRace] = useState<RaceSchedule | null>(null);
  const [nextRace, setNextRace] = useState<RaceSchedule | null>(null);
  const [raceDayTrackWeather, setRaceDayTrackWeather] =
    useState<TrackWeather | null>(null);
  const [weatherIcon, setWeatherIcon] = useState<WeatherIconProps | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [isRaceNameSticky, setIsRaceNameSticky] = useState(false);

  useEffect(() => {
    const now = new Date();
    const race = raceSchedule.find(
      (race) => race.Circuit.circuitId === circuit.circuitId
    );
    if (race) {
      setSelectedRace(race as RaceSchedule);
      setNextRace(race as RaceSchedule);
      const raceDate = parseISO(race.date + "T" + race.time);
      const diffInSeconds = differenceInSeconds(raceDate, now);
      setRemainingSeconds(diffInSeconds);
      const days = Math.floor(diffInSeconds / (3600 * 24));

      const nextRace = trackInfo.find(
        (track) => track.circuitId === race.Circuit.circuitId
      );
      const lat = nextRace?.Location.lat as string;
      const long = nextRace?.Location.long as string;
      const timezone = nextRace?.Location.timezone as string;
      const mainHourWeather = Number(race?.localRaceDateTime.slice(11, 13));
      if (days < 15 && days > 0) {
        //checking for under 15 days since api can't call exact dates further than 16 days out
        getRaceDayWeather(
          race.date,
          parseFloat(lat),
          parseFloat(long),
          timezone
        )
          .then((res) => {
            setRaceDayTrackWeather(res as TrackWeather);
            setWeatherIcon(
              getIcon(
                res.hourly[mainHourWeather - 1].iconCode
              ) as WeatherIconProps
            );
          })
          .catch((e) => {
            console.error(e);
            alert("Problem getting raceday weather data!");
          });

        const intervalId = setInterval(() => {
          setRemainingSeconds((prevRemainingSeconds) =>
            prevRemainingSeconds ? prevRemainingSeconds - 1 : null
          );
        }, 1000);
        return () => clearInterval(intervalId);
      } else {
        const intervalId = setInterval(() => {
          setRemainingSeconds((prevRemainingSeconds) =>
            prevRemainingSeconds ? prevRemainingSeconds - 1 : null
          );
        }, 1000);
        return () => clearInterval(intervalId);
      }
    }
  }, [raceSchedule]);

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

  if (!selectedRace) {
    return null; // no next race found
  }

  function getIcon(iconCode: string) {
    const weatherName = ICON_MAP.get(iconCode);
    const weather = icons.find((type) => type.weather === weatherName);
    return {
      weather: weather?.weather,
      viewBox: weather?.viewBox,
      d: weather?.d,
    };
  }

  function secondsToHms(d: number) {
    d = Number(d);
    const days = Math.floor(d / (3600 * 24));
    const hours = Math.floor((d % (3600 * 24)) / 3600);
    const minutes = Math.floor((d % 3600) / 60);
    const seconds = Math.floor(d % 60);
    return {
      days,
      hours,
      minutes,
      seconds,
    };
    // return `${days > 0 ? days : ""}${("0" + hours).slice(-2)}:${(
    //   "0" + minutes
    // ).slice(-2)}:${("0" + seconds).slice(-2)}`;
  }

  const formattedCountdown = secondsToHms(remainingSeconds as number);

  //using date-fns
  const firstPracticeDate = parseISO(
    selectedRace.FirstPractice.date + "T" + selectedRace.FirstPractice.time
  );
  const secondPracticeDate = parseISO(
    selectedRace.SecondPractice.date + "T" + selectedRace.SecondPractice.time
  );
  const qualifyingDate = parseISO(
    selectedRace.Qualifying.date + "T" + selectedRace.Qualifying.time
  );
  const raceDate = parseISO(selectedRace.date + "T" + selectedRace.time);

  const mainHourWeather = Number(nextRace?.localRaceDateTime.slice(11, 13)) - 1;
  const weatherTemp = raceDayTrackWeather?.hourly[mainHourWeather].temp;
  const rainProb = raceDayTrackWeather?.daily[0].precipitationSum;

  const winnerDriverArray =
    selectedRace.additionalInfo.mostDriverWins.split(", ");
  const winnerConstructorArray =
    selectedRace.additionalInfo.mostConstructorWins.split(", ");

  // console.log(isRaceNameSticky);
  return (
    <div
      // ref={containerRef}
      className="flex flex-col circuit-info--main-container mb-4 rounded-2xl"
    >
      <div className="flex items-center justify-between w-full">
        {formattedCountdown.days > 0 && (
          <div className="circuit-countdown--contianer-mobile rounded-t-lg w-full ">
            <div className="current-season-next-race--countdown-container flex justify-center">
              {/* <h3 className="self-center font-bold text-center px-4">
                  COUNTDOWN
                </h3> */}
              <div className="items-center justify-center flex w-[100px] my-2">
                <p className="text-2xl font-bold">{formattedCountdown.days}</p>
                <p className="self-start ml-1 text-sm labels">days</p>
              </div>
              <div className="items-center justify-center flex w-[100px] my-2">
                <p className="text-2xl font-bold">{formattedCountdown.hours}</p>
                <p className="self-start ml-1 text-sm font-light labels">hrs</p>
              </div>
              <div className="items-center justify-center flex w-[100px] my-2">
                <p className="text-2xl font-bold">
                  {formattedCountdown.minutes}
                </p>
                <p className="self-start ml-1 text-sm labels">mins</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="relative circuit-info--hero-container w-full h-[200px]">
        <img
          className="h-full w-full object-cover object-bottom opacity-70"
          src={selectedRace.additionalInfo.heroImgUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
        <div className="flex absolute bottom-3 right-3">
          <div className="mr-2 text-white flex flex-col items-end justify-center">
            <p className="text-base leading-4 mr-1">
              {selectedRace.Circuit?.Location?.locality}
            </p>
            <p className="text-2xl leading-6 font-bold">
              {selectedRace.Circuit?.Location?.country}
            </p>
          </div>
          <img
            className="rounded-sm w-20 border-2 border-gray-200"
            src={selectedRace.additionalInfo.flagUrl}
            alt={selectedRace.Circuit.circuitName}
          />
        </div>
        <div className="absolute top-3 right-3 w-max py-1 px-2 rounded-md text-white circuit-info--round">
          <p className="text-md">ROUND {selectedRace.round}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="px-4 pt-4 text-3xl font-bold">
          {selectedRace.Circuit.circuitName}
        </h3>
        <div
          className={`flex w-full -ml-4 p-4 h-max items-center justify-center gap-4 ${
            isRaceNameSticky ? "fixed header-sticky-title" : "hidden"
          }`}
        >
          <h3 className="text-xl font-bold">
            {selectedRace.Circuit.circuitName}
          </h3>
          <img
            className="rounded-sm w-14 border-2 border-gray-200"
            src={selectedRace.additionalInfo.flagUrl}
            alt={selectedRace.Circuit.circuitName}
          />
        </div>
        <div ref={mainContentRef} className="px-4 flex flex-col">
          <h4 className="ml-1 circuit-info--text">Grand Prix Time Chart</h4>
          <div className="circuit-times-table rounded-md mt-2">
            <div className="flex p-2 justify-between">
              <div className="w-[95px] font-bold">Practice 1</div>
              <div className="w-[105px] text-center">
                {new Date(firstPracticeDate).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="w-[120px] text-right">
                {new Date(firstPracticeDate).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                  timeZoneName: "short",
                })}
              </div>
            </div>
            {qualifyingDate > secondPracticeDate ? (
              <>
                <div className="flex p-2 justify-between">
                  <div className="w-[95px] font-bold">Practice 2</div>
                  <div className="w-[105px] text-center">
                    {new Date(secondPracticeDate).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="w-[120px] text-right">
                    {new Date(secondPracticeDate).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                      timeZoneName: "short",
                    })}
                  </div>
                </div>
                {selectedRace.ThirdPractice && (
                  <div className="flex p-2 justify-between">
                    <div className="w-[95px] font-bold">Practice 3</div>
                    <div className="w-[105px] text-center">
                      {new Date(
                        selectedRace.ThirdPractice.date +
                          "T" +
                          selectedRace.ThirdPractice.time
                      ).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="w-[120px] text-right">
                      {new Date(
                        selectedRace.ThirdPractice.date +
                          "T" +
                          selectedRace.ThirdPractice.time
                      ).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                        timeZoneName: "short",
                      })}
                    </div>
                  </div>
                )}
                <div className="flex p-2 justify-between">
                  <div className="w-[95px] font-bold">Qualifying</div>
                  <div className="w-[105px] text-center">
                    {new Date(qualifyingDate).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="w-[120px] text-right">
                    {new Date(qualifyingDate).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                      timeZoneName: "short",
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex p-2 justify-between">
                  <div className="w-[95px] font-bold">Qualifying</div>
                  <div className="w-[105px] text-center">
                    {new Date(qualifyingDate).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="w-[120px] text-right">
                    {new Date(qualifyingDate).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                      timeZoneName: "short",
                    })}
                  </div>
                </div>
                <div className="flex p-2 justify-between">
                  <div className="w-[95px] font-bold">Practice 2</div>
                  <div className="w-[105px] text-center">
                    {new Date(secondPracticeDate).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="w-[120px] text-right">
                    {new Date(secondPracticeDate).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                      timeZoneName: "short",
                    })}
                  </div>
                </div>
                {selectedRace.Sprint && (
                  <div className="flex p-2 justify-between">
                    <div className="w-[95px] font-bold">Sprint</div>
                    <div className="w-[105px] text-center">
                      {new Date(
                        parseISO(
                          selectedRace.Sprint.date +
                            "T" +
                            selectedRace.Sprint.time
                        )
                      ).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="w-[120px] text-right">
                      {new Date(
                        parseISO(
                          selectedRace.Sprint.date +
                            "T" +
                            selectedRace.Sprint.time
                        )
                      ).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                        timeZoneName: "short",
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="flex p-2 justify-between">
              <div className="w-[95px] font-bold">Race</div>
              <div className="w-[105px] text-center">
                {new Date(raceDate).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="w-[120px] text-right">
                {new Date(raceDate).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                  timeZoneName: "short",
                })}
              </div>
            </div>
            {selectedRace.round === nextRace?.round && weatherIcon !== null && (
              <div className="flex items-center  gap-2 px-2 pb-2">
                <h6 className="text-sm">Forcasted race weather:</h6>
                <div className="text-lg font-bold leading-none">
                  {weatherTemp}&deg;
                </div>
                <div className="w-[20px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={weatherIcon?.viewBox}
                  >
                    <path d={weatherIcon?.d} />
                  </svg>
                </div>
                <p className="text-sm leading-none self-end">
                  {rainProb}" <span className="text-xs">of rain</span>
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="circuit-img--container-mobile">
          <div className="px-4">
            <img
              src={selectedRace.additionalInfo.imgUrl}
              alt={selectedRace.Circuit.circuitName}
            />
          </div>
          <div className="px-6 my-4 gap-4 flex flex-col">
            <div className="circuit-round">
              <p className="text-sm">
                Track Type:{" "}
                <span className="font-bold">
                  {selectedRace.additionalInfo.trackType}
                </span>
              </p>
            </div>
            <div className="circuit-round">
              <p className="text-sm">
                Track Comments:{" "}
                <span className="font-bold">
                  {selectedRace.additionalInfo.trackComments}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 flex flex-wrap gap-4 my-4">
          <div className="flex-grow circuit-laps border-l-2 border-b-2 pl-2 pb-1 rounded-bl-2xl border-gray-300">
            <p className="text-sm circuit-info--text">Events Held</p>
            <p className="font-bold text-2xl">
              {selectedRace.additionalInfo.numberOfTimesHeld}
            </p>
          </div>
          <div className="flex-grow circuit-round border-l-2 border-b-2 pl-2 pb-1 rounded-bl-2xl border-gray-300">
            <p className="text-sm circuit-info--text">First Grand Prix</p>
            <p className="font-bold text-2xl">
              {selectedRace.additionalInfo.firstGrandPrix}
            </p>
          </div>
          <div className="flex-grow circuit-round border-l-2 border-b-2 pl-2 pb-1 rounded-bl-2xl border-gray-300">
            <p className="text-sm circuit-info--text">Number of Laps</p>
            <p className="font-bold text-2xl">
              {selectedRace.additionalInfo.laps}
            </p>
          </div>
          <div className="flex-grow circuit-round border-l-2 border-b-2 pl-2 pb-1 rounded-bl-2xl border-gray-300">
            <p className="text-sm circuit-info--text">Circuit Length</p>
            <p className="font-bold text-2xl">
              {selectedRace.additionalInfo.circuitLength}{" "}
              <span className="text-base font-normal">km</span>
            </p>
          </div>
          <div className="flex-grow circuit-round border-l-2 border-b-2 pl-2 pb-1 rounded-bl-2xl border-gray-300">
            <p className="text-sm circuit-info--text">Race Distance</p>
            <p className="font-bold text-2xl">
              {selectedRace.additionalInfo.raceLength}{" "}
              <span className="text-base font-normal">km</span>
            </p>
          </div>
        </div>
        <div className="px-4 flex flex-col">
          <div className="flex flex-col justify-end pl-1">
            <div className="flex flex-col gap-2 mb-2">
              <h5 className="text-lg font-bold border-b-2 border-gray-200">
                Qualifying
              </h5>
              <div className="flex circuit-laps mx-2">
                <p className="text-sm w-1/2 circuit-info--text">
                  Previous Pole
                </p>
                {selectedRace.previousPoleWinner?.season !== null ? (
                  <div className="flex flex-col items-end w-1/2">
                    <p className="text-lg font-bold leading-none">
                      {selectedRace.previousPoleWinner?.qualifyingResults?.Q3}
                      <span className="font-light text-xs">s </span>
                    </p>
                    <p className="text-xs font-normal">
                      {
                        selectedRace.previousPoleWinner?.qualifyingResults
                          ?.Driver.givenName
                      }{" "}
                      {
                        selectedRace.previousPoleWinner?.qualifyingResults
                          ?.Driver.familyName
                      }{" "}
                      ({selectedRace.previousPoleWinner?.season})
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-end w-1/2">
                    <p className="text-sm font-bold">n/a</p>
                  </div>
                )}
              </div>
              <div className="flex circuit-laps mx-2">
                <p className="text-sm w-1/2 circuit-info--text">Fastest Pole</p>
                {selectedRace.previousPoleWinner?.season !== null ? (
                  <div className="flex flex-col items-end w-1/2">
                    <p className="text-lg font-bold leading-none">
                      {selectedRace.additionalInfo.qualiRecord.time}
                      <span className="font-light text-xs">s </span>
                    </p>
                    <p className="text-xs font-normal">
                      {selectedRace.additionalInfo.qualiRecord.driver} (
                      {selectedRace.additionalInfo.qualiRecord.year})
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-end w-1/2">
                    <p className="text-sm font-bold">n/a</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h5 className="text-lg font-bold border-b-2 border-gray-200">
                Race
              </h5>
              <div className="flex circuit-laps mx-2">
                <p className="text-sm w-1/2 circuit-info--text">
                  Previous Winner
                </p>
                {selectedRace.previousPoleWinner?.season !== null ? (
                  <div className="flex flex-col items-end w-1/2">
                    <p className="text-base font-bold leading-none">
                      {
                        selectedRace.previousRaceInfo?.raceResults?.Driver
                          .givenName
                      }{" "}
                      {
                        selectedRace.previousRaceInfo?.raceResults?.Driver
                          .familyName
                      }{" "}
                    </p>

                    <p className="text-xs font-normal">
                      from P{selectedRace.previousRaceInfo?.raceResults?.grid} (
                      {selectedRace.previousRaceInfo?.season})
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-end w-1/2">
                    <p className="text-sm font-bold">n/a</p>
                  </div>
                )}
              </div>
              <div className="flex circuit-laps mx-2">
                <p className="text-sm w-1/2 circuit-info--text">Fastest Lap</p>
                {selectedRace.previousPoleWinner?.season !== null ? (
                  <div className="flex flex-col items-end w-1/2">
                    <p className="text-lg font-bold leading-none">
                      {selectedRace.additionalInfo.lapRecord.time}
                      <span className="font-light text-xs">s </span>
                    </p>
                    <p className="text-xs font-normal">
                      {selectedRace.additionalInfo.lapRecord.driver} (
                      {selectedRace.additionalInfo.lapRecord.year})
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-end w-1/2">
                    <p className="text-sm font-bold">n/a</p>
                  </div>
                )}
              </div>
              <div className="circuit-round flex mx-2 justify-between">
                <p className="text-sm w-max circuit-info--text">
                  Most Driver Wins
                </p>
                <ul className="flex flex-col items-end">
                  {winnerDriverArray.map((name) => (
                    <li
                      key={name}
                      className={
                        name === "n/a"
                          ? "flex w-full items-end"
                          : "flex flex-col w-full items-end mb-2"
                      }
                    >
                      {name === "n/a" ? (
                        <p className="text-sm font-bold">n/a</p>
                      ) : (
                        <>
                          <p className="text-sm font-bold">
                            {name.split(" (")[0]}
                          </p>
                          <p className="text-xs font-normal">
                            {name.split(" ")[2]} {name.split(" ")[3]}
                          </p>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="circuit-round flex mx-2 justify-between">
                <p className="text-sm w-max circuit-info--text">
                  Most Constructor Wins
                </p>
                <ul className="flex flex-col items-end">
                  {winnerConstructorArray.map((name) => (
                    <li
                      key={name}
                      className="flex flex-col w-full items-end mb-2"
                    >
                      <p className="text-sm font-bold">{name.split(" (")[0]}</p>
                      {name.split(" (")[0] === "Red Bull" ? (
                        <p className="text-xs font-normal">
                          {name.split(" ")[2]} {name.split(" ")[3]}{" "}
                        </p>
                      ) : (
                        <p className="text-xs font-normal">
                          {name.split(" ")[1]} {name.split(" ")[2]}{" "}
                          {name.split(" ")[3]}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 mb-4">
          <p className="font-bold border-b-2 border-gray-300">
            General Comments
          </p>
          <ul className="ml-1">
            <li className="text-sm w-full my-4">
              <p className="leading-6">
                {"1) "}
                {selectedRace.additionalInfo.grandPrixComments[1]}
              </p>
            </li>
            <li className="text-sm w-full my-4">
              <p className="leading-6">
                {"2) "}
                {selectedRace.additionalInfo.grandPrixComments[2]}
              </p>
            </li>
            {selectedRace.additionalInfo.grandPrixComments[3] != null && (
              <li className="text-sm w-full my-4">
                <p className="leading-6">
                  {"3) "}
                  {selectedRace.additionalInfo.grandPrixComments[3]}
                </p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
