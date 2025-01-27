import { useEffect, useState } from "react";
import { differenceInSeconds, formatDuration, parseISO } from "date-fns";
import trackInfo from "../../data/trackInfo.json";
import { ICON_MAP } from "../../utilities/Weather/iconMap";
import icons from "../../utilities/Weather/icons.json";
import {
  getRaceDayWeather,
  getWeather,
} from "../../utilities/Weather/getWeather";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
};

type NextRaceWidgetProps = {
  raceSchedule: RaceSchedule[];
  screenWidth: number;
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

type WeatherIcon = {
  weather: string;
  viewBox: string;
  d: string;
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

export function NextRaceDetailedWidget({
  raceSchedule,
  screenWidth,
}: NextRaceWidgetProps) {
  const [nextRace, setNextRace] = useState<UpdatedSchedule | null>(null);
  const [raceDayTrackWeather, setRaceDayTrackWeather] =
    useState<TrackWeather | null>(null);
  const [weatherIcon, setWeatherIcon] = useState<WeatherIcon | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
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

      return {
        ...value,
        additionalInfo,
        localRaceDateTime: getLocalTime(
          value.date,
          value.time,
          Number(additionalInfo?.Location.gmtOffset)
        ),
      };
    });

    const now = new Date();
    // sort the races by date in ascending order
    const sortedRaces = updatedRaceSchedule.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    // find the first race that is in the future compared to the current date + time
    const race = sortedRaces.find(
      (race) => new Date(race.date + "T" + race.time) >= now
    );

    if (race) {
      setNextRace(race as UpdatedSchedule);

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
      if (days < 15) {
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
              getIcon(res.hourly[mainHourWeather - 1].iconCode) as WeatherIcon
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
  }

  const formattedCountdown = secondsToHms(remainingSeconds as number);
  if (!nextRace) {
    return null; // no next race found
  }
  //using date-fns
  const firstPracticeDate = parseISO(
    nextRace.FirstPractice.date + "T" + nextRace.FirstPractice.time
  );
  const secondPracticeDate = parseISO(
    nextRace.SecondPractice.date + "T" + nextRace.SecondPractice.time
  );
  const qualifyingDate = parseISO(
    nextRace.Qualifying.date + "T" + nextRace.Qualifying.time
  );
  const raceDate = parseISO(nextRace.date + "T" + nextRace.time);

  const mainHourWeather = Number(nextRace?.localRaceDateTime.slice(11, 13)) - 1;
  const weatherTemp = raceDayTrackWeather?.hourly[mainHourWeather].temp;
  const rainProb = raceDayTrackWeather?.daily[0].precipitationSum;

  function padNumber(number: number) {
    if (number < 10) return "0" + number;
    else return number;
  }

  return (
    <div className={screenWidth <= 568 ? "mb-20" : "w-[568px]"}>
      <div className="w-full">
        <h3 className="p-2 py-4 text-2xl font-bold leading-4">
          NEXT RACE
          <span className="font-extralight">
            {" - "}
            ROUND {nextRace.round}
          </span>
        </h3>
        <div className="home-next-race--container flex flex-col rounded-lg border-2 border-gray-700">
          <div
            className={`p-4 ${
              screenWidth <= 568 ? "flex flex-col" : "flex justify-between"
            }`}
          >
            <div className="flex flex-col w-max h-max">
              <div className="flex items-center gap-4">
                <img
                  className="rounded-sm w-16 border-2 border-gray-200"
                  src={nextRace.additionalInfo.flagUrl}
                  alt={nextRace.Circuit.circuitName}
                />
                <Link to="/schedule">
                  <h3 className="relative text-3xl font-bold w-full">
                    {nextRace.Circuit.Location.country}
                    <span className="absolute bottom-1 text-sm px-2">
                      <FontAwesomeIcon icon="up-right-from-square" />
                    </span>
                  </h3>
                </Link>
              </div>
              <h4 className="text-xl font-light self-left mt-2 w-max">
                {nextRace.Circuit.circuitName}
              </h4>
            </div>
            <div className="w-max h-max home-next-race--countdown-container flex mt-4 gap-2">
              <div className="flex flex-col text-center w-[50px]">
                <p className="text-3xl font-bold">
                  {padNumber(formattedCountdown.days)}
                </p>
                <p className="text-md">days</p>
              </div>
              <div className="flex flex-col text-center w-[50px]">
                <p className="text-3xl font-bold">
                  {padNumber(formattedCountdown.hours)}
                </p>
                <p className="text-md">hrs</p>
              </div>
              <div className="flex flex-col text-center w-[50px]">
                <p className="text-3xl font-bold">
                  {padNumber(formattedCountdown.minutes)}
                </p>
                <p className="text-md">mins</p>
              </div>
              <div className="flex flex-col text-center w-[50px]">
                <p className="text-3xl font-bold">
                  {padNumber(formattedCountdown.seconds)}
                </p>
                <p className="text-md">secs</p>
              </div>
            </div>
          </div>
          <div className="home-next-race--times-container rounded-b-md">
            <div className="flex p-2 justify-between border-b-2 border-gray-300">
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
                <div className="flex p-2 justify-between border-b-2 border-gray-300">
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
                {nextRace.ThirdPractice && (
                  <div className="flex p-2 justify-between border-b-2 border-gray-300">
                    <div className="w-[95px] font-bold">Practice 3</div>
                    <div className="w-[105px] text-center">
                      {new Date(
                        nextRace.ThirdPractice.date +
                          "T" +
                          nextRace.ThirdPractice.time
                      ).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="w-[120px] text-right">
                      {new Date(
                        nextRace.ThirdPractice.date +
                          "T" +
                          nextRace.ThirdPractice.time
                      ).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                        timeZoneName: "short",
                      })}
                    </div>
                  </div>
                )}
                <div className="flex p-2 justify-between border-b-2 border-gray-300">
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
                <div className="flex p-2 justify-between border-b-2 border-gray-300">
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
                <div className="flex p-2 justify-between border-b-2 border-gray-300">
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
                {nextRace.Sprint && (
                  <div className="flex p-2 justify-between border-b-2 border-gray-300">
                    <div className="w-[95px] font-bold">Sprint</div>
                    <div className="w-[105px] text-center">
                      {new Date(
                        parseISO(
                          nextRace.Sprint.date + "T" + nextRace.Sprint.time
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
                          nextRace.Sprint.date + "T" + nextRace.Sprint.time
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

            {weatherIcon !== null && (
              <div className="flex items-center justify-end gap-2 mr-2 px-2 pb-2">
                <div className="text-lg leading-none">{weatherTemp}&deg;</div>
                <div className="w-[20px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={weatherIcon?.viewBox}
                  >
                    <path d={weatherIcon?.d} />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
