import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";

export const getCurrentConstructorDNFs = <T>(
  config: AxiosRequestConfig<any>,
  loadOnStart: boolean = true
): [boolean, T | undefined, string, () => void] => {
  const [constructorDNFs, setConstructorDNFs] = useState<T>();
  const [loadingDNFs, setLoadingDNFs] = useState(true);
  const [errorDNFs, setError] = useState("");

  useEffect(() => {
    if (loadOnStart) getConstructorDNFs();
  }, []);

  const requestDNFs = () => {
    getConstructorDNFs();
  };

  const getConstructorDNFs = () => {
    setLoadingDNFs(true);
    axios(config)
      .then((response) => {
        setError("");
        setConstructorDNFs(response.data.MRData.StatusTable);
      })
      .catch((errorDNFs) => {
        setError(errorDNFs.message);
      })
      .finally(() => setLoadingDNFs(false));
  };

  return [loadingDNFs, constructorDNFs, errorDNFs, requestDNFs];
};
