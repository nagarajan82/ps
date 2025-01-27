import { useEffect, useState } from "react";
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

export function CircuitDetailedWidget({
  circuit,
  raceSchedule,
}: CircuitDetailedWidgetProps) {
  const [selectedRace, setSelectedRace] = useState<RaceSchedule | null>(null);
  const [nextRace, setNextRace] = useState<RaceSchedule | null>(null);
  const [raceDayTrackWeather, setRaceDayTrackWeather] =
    useState<TrackWeather | null>(null);
  const [weatherIcon, setWeatherIcon] = useState<WeatherIconProps | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

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

  return (
    <div className="flex flex-col circuit-info--main-container mb-4 rounded-2xl">
      <div className="relative circuit-info--hero-container w-full h-[250px] ">
        <img
          className="h-full w-full object-cover object-bottom rounded-t-2xl opacity-70"
          src={selectedRace.additionalInfo.heroImgUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
        <h3 className="absolute bottom-6 left-6 text-4xl font-bold text-white">
          {selectedRace.Circuit.circuitName}
        </h3>
        <img
          className="absolute bottom-6 right-6 rounded-sm w-20 border-2 border-gray-200"
          src={selectedRace.additionalInfo.flagUrl}
          alt={selectedRace.Circuit.circuitName}
        />
        <div className="absolute top-4 right-6 py-1 px-2 rounded-md text-white circuit-info--round">
          <p className="text-md">ROUND {selectedRace.round}</p>
        </div>
        <div className="absolute top-4 left-6 flex items-center justify-between">
          {formattedCountdown.days > 0 && (
            <div className="circuit-countdown--contianer rounded-lg">
              <div className="current-season-next-race--countdown-container flex">
                {/* <h3 className="self-center font-bold text-center px-4">
                  COUNTDOWN
                </h3> */}
                <div className="items-center justify-center flex w-[100px] my-2">
                  <p className="text-2xl font-bold">
                    {formattedCountdown.days}
                  </p>
                  <p className="self-start ml-1 text-sm labels">days</p>
                </div>
                <div className="items-center justify-center flex w-[100px] my-2">
                  <p className="text-2xl font-bold">
                    {formattedCountdown.hours}
                  </p>
                  <p className="self-start ml-1 text-sm font-light labels">
                    hrs
                  </p>
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
        <div className="absolute bottom-6 right-28 mr-1 text-white flex flex-col items-end">
          <p className="text-lg leading-4 mr-1">
            {selectedRace.Circuit?.Location?.locality}
          </p>
          <p className="text-4xl leading-8 font-bold">
            {selectedRace.Circuit?.Location?.country}
          </p>
        </div>
        {selectedRace.round === nextRace?.round && weatherIcon !== null && (
          <div className="absolute text-white bottom-20  right-6 circuit-weather flex flex-col">
            <p className="text-sm">Race Weather</p>
            <div className="flex">
              <div className="text-2xl mr-2 font-bold">{weatherTemp}&deg;</div>
              <div className="w-[40px] h-full self-center">
                <svg
                  className="fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox={weatherIcon?.viewBox}
                >
                  <path d={weatherIcon?.d} />
                </svg>
              </div>
            </div>
            <p className="text-xs font-light self-end leading-3 mt-1 mr-1">
              ({rainProb}" of rain)
            </p>
          </div>
        )}
      </div>
      <div className="flex p-4 gap-4 circuit-info--sub-container justify-between">
        <div className="flex flex-col w-2/5">
          <div className="flex flex-col">
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
          <div className="flex flex-wrap gap-4 my-4">
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
          <div className="flex flex-col">
            {/* <div className="">
              <h4 className="text-2xl my-2 font-bold">Historical</h4>
            </div> */}
            <div className="flex flex-col justify-end pl-1">
              <div className="flex flex-col gap-2 mb-4">
                <h5 className="text-lg border-b-2 border-gray-200">
                  Qualifying
                </h5>
                <div className="flex circuit-laps items-end">
                  <p className="text-sm w-[155px] mr-2 circuit-info--text">
                    Previous Pole
                  </p>
                  {selectedRace.previousPoleWinner?.season !== null ? (
                    <>
                      <p className="w-[90px] text-lg font-bold leading-none mr-2">
                        {selectedRace.previousPoleWinner?.qualifyingResults?.Q3}
                        <span className="font-light text-xs">s </span>
                      </p>
                      <p className="text-sm font-normal">
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
                    </>
                  ) : (
                    <p className="text-sm">n/a</p>
                  )}
                </div>
                <div className="flex circuit-laps items-end">
                  <p className="text-sm w-[155px] mr-2 circuit-info--text">
                    Fastest Pole
                  </p>
                  {selectedRace.previousPoleWinner?.season !== null ? (
                    <>
                      <p className="w-[90px] text-lg font-bold leading-none mr-2">
                        {selectedRace.additionalInfo.qualiRecord.time}
                        <span className="font-light text-xs">s </span>
                      </p>
                      <p className="text-sm font-normal">
                        {selectedRace.additionalInfo.qualiRecord.driver} (
                        {selectedRace.additionalInfo.qualiRecord.year})
                      </p>
                    </>
                  ) : (
                    <p className="text-sm">n/a</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-lg border-b-2 border-gray-200">Race</h5>
                <div className="flex circuit-laps items-end">
                  <p className="text-sm w-[155px] mr-2 circuit-info--text">
                    Previous Winner
                  </p>
                  {selectedRace.previousPoleWinner?.season !== null ? (
                    <p className="text-lg font-bold leading-none mr-2">
                      {
                        selectedRace.previousRaceInfo?.raceResults?.Driver
                          .givenName
                      }{" "}
                      {
                        selectedRace.previousRaceInfo?.raceResults?.Driver
                          .familyName
                      }{" "}
                      <span className="text-sm font-normal">
                        ({selectedRace.previousRaceInfo?.season})
                      </span>
                      <span className="text-sm font-normal">
                        {" "}
                        from P{selectedRace.previousRaceInfo?.raceResults?.grid}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm">n/a</p>
                  )}
                </div>
                <div className="flex circuit-laps items-end">
                  <p className="text-sm w-[155px] mr-2 circuit-info--text">
                    Fastest Lap
                  </p>
                  {selectedRace.previousPoleWinner?.season !== null ? (
                    <>
                      <p className="w-[90px] text-lg font-bold leading-none mr-2">
                        {selectedRace.additionalInfo.lapRecord.time}
                        <span className="font-light text-xs">s </span>
                      </p>
                      <p className="text-sm font-normal">
                        {selectedRace.additionalInfo.lapRecord.driver} (
                        {selectedRace.additionalInfo.lapRecord.year})
                      </p>
                    </>
                  ) : (
                    <p className="text-sm">n/a</p>
                  )}
                </div>
                <div className="circuit-round flex w-max">
                  <p className="text-sm w-[155px] mr-2 circuit-info--text">
                    Most Driver Wins
                  </p>
                  <ul>
                    {winnerDriverArray.map((name) => (
                      <li key={name} className="font-bold text-sm w-max">
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="circuit-round flex w-max">
                  <p className="text-sm w-[155px] mr-2 circuit-info--text">
                    Most Constructor Wins
                  </p>
                  <ul>
                    {winnerConstructorArray.map((name) => (
                      <li key={name} className="font-bold text-sm w-max">
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-3/5">
          <div className="circuit-img--container rounded-md">
            <div className="p-4">
              <img
                src={selectedRace.additionalInfo.imgUrl}
                alt={selectedRace.Circuit.circuitName}
              />
            </div>
            <div className="px-4 mb-4 gap-4 flex flex-col">
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
          <div className="mx-1 mt-4">
            <p className="text-base border-b-2 border-gray-300">
              General Comments
            </p>
            <ul className="ml-1">
              <li className="text-sm w-full my-2">
                {"1) "}
                {selectedRace.additionalInfo.grandPrixComments[1]}
              </li>
              <li className="text-sm w-full my-2">
                {"2) "}
                {selectedRace.additionalInfo.grandPrixComments[2]}
              </li>
              {selectedRace.additionalInfo.grandPrixComments[3] != null && (
                <li className="text-sm w-full my-2">
                  {"3) "}
                  {selectedRace.additionalInfo.grandPrixComments[3]}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
