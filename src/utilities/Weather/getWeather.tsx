import axios from "axios";

export function getWeather(lat: number, long: number, timezone: string) {
  return axios
    .get(
      `https://api.open-meteo.com/v1/forecast?&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&forecast_days=16&temperature_unit=fahrenheit`,
      {
        params: {
          latitude: lat,
          longitude: long,
          timezone,
        },
      }
    )
    .then(({ data }) => {
      // console.log(data);
      return {
        current: parseCurrentWeather(data),
        daily: parseDailyWeather(data),
        hourly: parseHourlyWeatherCurrent(data),
      };
    });
}

export function getRaceDayWeather(
  race_date: string,
  lat: number,
  long: number,
  timezone: string
) {
  return axios
    .get(
      `https://api.open-meteo.com/v1/forecast?&latitude=${lat}&longitude=${long}&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&timeformat=unixtime&start_date=${race_date}&end_date=${race_date}&temperature_unit=fahrenheit`,
      {
        params: {
          timezone,
        },
      }
    )
    .then(({ data }) => {
      return {
        daily: parseDailyWeather(data),
        hourly: parseHourlyWeather(data),
      };
    });
}

function parseCurrentWeather({ current_weather, daily }: any) {
  const {
    temperature: currentTemp,
    windspeed: windSpeed,
    weathercode: iconCode,
  } = current_weather;

  const {
    temperature_2m_max: [maxTemp],
    temperature_2m_min: [minTemp],
    apparent_temperature_max: [maxFeelsLike],
    apparent_temperature_min: [minFeelsLike],
    precipitation_sum: [precip],
  } = daily;
  // the above line (for each) could also be written as...
  // const maxTemp = daily.temperature_2m_max[0]

  return {
    currentTemp: Math.round(currentTemp),
    highTemp: Math.round(maxTemp),
    lowTemp: Math.round(minTemp),
    feelsLikeHigh: Math.round(maxFeelsLike),
    feelsLikeLow: Math.round(minFeelsLike),
    windSpeed: Math.round(windSpeed),
    precip: Math.round(precip * 100) / 100,
    iconCode,
  };
}

function parseDailyWeather({ daily }: any) {
  return daily.time.map((time: any, index: number) => {
    return {
      timestamp: time * 1000,
      iconCode: daily.weathercode[index],
      maxTemp: Math.round(daily.temperature_2m_max[index]),
      precipitationSum: daily.precipitation_sum,
    };
  });
}

function parseHourlyWeatherCurrent({ hourly, current_weather }: any) {
  return hourly.time
    .map((time: any, index: number) => {
      return {
        timestamp: time * 1000,
        iconCode: hourly.weathercode[index],
        temp: Math.round(hourly.temperature_2m[index]),
        feelsLike: Math.round(hourly.apparent_temperature[index]),
        windSpeed: Math.round(hourly.windspeed_10m[index]),
        precip: Math.round(hourly.precipitation[index] * 100) / 100,
      };
    })
    .filter(({ timestamp }: any) => timestamp >= current_weather.time * 1000);
}

function parseHourlyWeather({ hourly, current_weather }: any) {
  return hourly.time.map((time: any, index: number) => {
    return {
      timestamp: time * 1000,
      iconCode: hourly.weathercode[index],
      temp: Math.round(hourly.temperature_2m[index]),
      feelsLike: Math.round(hourly.apparent_temperature[index]),
      windSpeed: Math.round(hourly.windspeed_10m[index]),
      precip: Math.round(hourly.precipitation[index] * 100) / 100,
    };
  });
}
