import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";

export const getCurrentDriverStandings = <T>(
  config: AxiosRequestConfig<any>,
  loadOnStart: boolean = true
): [boolean, T | undefined, string, () => void] => {
  const [driverStandings, setDriverStandings] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loadOnStart) getDriverStandings();
  }, []);

  const request = () => {
    getDriverStandings();
  };

  const getDriverStandings = () => {
    setLoading(true);
    axios(config)
      .then((response) => {
        setError("");
        setDriverStandings(
          response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings
        );
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setLoading(false));
  };

  return [loading, driverStandings, error, request];
};
