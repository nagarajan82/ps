import { useEffect, useState } from "react";
import { RaceResults } from "../components/CurrentSeason/RaceResults";

type ScreenWidthProps = {
  screenWidth: number;
};

export function RaceResultsPage({ screenWidth }: ScreenWidthProps) {
  const [showWarning, setShowWarning] = useState(
    localStorage.getItem("showWarning") === null ? false : true
  );

  const handleAcknowledgment = () => {
    setShowWarning(false);
    localStorage.setItem("showWarning", "false");
  };

  useEffect(() => {
    if (localStorage.getItem("showWarning") === "false") {
      setShowWarning(false);
    }
  }, []);

  return (
    <div className={screenWidth <= 768 ? "h-full" : "relative h-full"}>
      {showWarning && (
        <div
          className={`flex justify-center items-center 
              ${
                screenWidth <= 768
                  ? "race-results--warning-main-container-mobile"
                  : "race-results--warning-main-container"
              }`}
        >
          <div
            className={`rounded-lg 
              ${
                screenWidth <= 768
                  ? "race-results--warning-container-mobile p-4 mx-10"
                  : "race-results--warning-container p-8"
              }`}
          >
            <p className="text-xl font-bold mb-2">Warning: Spoilers Ahead</p>
            <p className="mb-4">
              The following content contains race results. Are you sure you want
              to continue?
            </p>
            <button
              className="px-3 py-2 race-results--warning-btn rounded-lg"
              onClick={handleAcknowledgment}
            >
              <p>I understand, show me the results!</p>
            </button>
          </div>
        </div>
      )}
      <div
        // className={screenWidth <= 450 ? "race-results-mobile" : "race-results"}
        className={
          showWarning
            ? "hidden"
            : screenWidth <= 450
            ? "race-results-mobile"
            : "race-results"
        }
      >
        <h1
          className={
            screenWidth <= 450 ? "font-bold" : "font-bold pt-6 mb-4 mx-8"
          }
        >
          Race Results
        </h1>
        <RaceResults screenWidth={screenWidth} />
      </div>
    </div>
  );
}
