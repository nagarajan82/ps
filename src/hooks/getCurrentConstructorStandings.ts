import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";

export const getCurrentConstructorStandings = <T>(
  config: AxiosRequestConfig<any>,
  loadOnStart: boolean = true
): [boolean, T | undefined, string, () => void] => {
  const [constructorStandings, setConstructorStandings] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loadOnStart) getConstructorStandings();
  }, []);

  const request = () => {
    getConstructorStandings();
  };

  const getConstructorStandings = () => {
    setLoading(true);
    axios(config)
      .then((response) => {
        setError("");
        setConstructorStandings(
          response.data.MRData.StandingsTable.StandingsLists[0]
            .ConstructorStandings
        );
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setLoading(false));
  };

  return [loading, constructorStandings, error, request];
};
