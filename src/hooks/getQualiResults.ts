import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";

export const getQualiResults = <T>(
  config: AxiosRequestConfig<any>,
  loadOnStart: boolean = true
): [boolean, T | undefined, string, () => void] => {
  const [qualiStandings, setQualiStandings] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loadOnStart) getCurrentQualiResults();
  }, []);

  const request = () => {
    getCurrentQualiResults();
  };

  const getCurrentQualiResults = () => {
    setLoading(true);
    axios(config)
      .then((response) => {
        setError("");
        setQualiStandings(response.data.MRData.RaceTable.Races);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setLoading(false));
  };

  return [loading, qualiStandings as any, error, request];
};
