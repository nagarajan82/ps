import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";

export const getRaceSchedule = <T>(
  config: AxiosRequestConfig<any>,
  loadOnStart: boolean = true
): [boolean, T | undefined, string, () => void] => {
  const [raceSchedule, setRaceSchedule] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loadOnStart) getRaceScheduleData();
  }, []);

  const request = () => {
    getRaceScheduleData();
  };

  const getRaceScheduleData = () => {
    setLoading(true);
    axios(config)
      .then((response) => {
        setError("");
        setRaceSchedule(response.data.MRData.RaceTable.Races);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setLoading(false));
  };

  return [loading, raceSchedule as any, error, request];
};
