import { getRaceSchedule } from "../../hooks/getRaceSchedule";
import { getRecentPole } from "../../hooks/getRecentPole";
import { getRecentRaceResults } from "../../hooks/getRecentRaceResults";
import { RaceScheduleWidget } from "../../widgets/CurrentSeason/RaceScheduleWidget";
import { RaceScheduleWidgetMobile } from "../../widgets/CurrentSeason/RaceScheduleWidgetMobile";

type ScreenWidthProps = {
  screenWidth: number;
};

export function RaceSchedule({ screenWidth }: ScreenWidthProps) {
  const [loading, raceSchedule, error, request] = getRaceSchedule({
    method: "get",
    url: "https://ergast.com/api/f1/current.json",
  });

  console.log(raceSchedule)

  const recentRacesResults = getRecentRaceResults();
  const recentPoleWinners = getRecentPole();

  if (loading) {
    return (
      <div className="ml-8 mt-6">
        <p>Loading...</p>
      </div>
    );
  }
  if (error !== "") {
    return (
      <div className="ml-8 mt-6">
        <p>{error}</p>
      </div>
    );
  }
  if (!raceSchedule) {
    return (
      <div className="ml-8 mt-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className={
        screenWidth <= 450
          ? "race-schedule-container-mobile m-4"
          : "race-schedule-container"
      }
    >
      {screenWidth <= 450 ? (
        <RaceScheduleWidgetMobile
          raceSchedule={raceSchedule as any}
          recentRacesResults={recentRacesResults as any}
          recentPoleWinners={recentPoleWinners as any}
          screenWidth={screenWidth}
        />
      ) : (
        <RaceScheduleWidget
          raceSchedule={raceSchedule as any}
          recentRacesResults={recentRacesResults as any}
          recentPoleWinners={recentPoleWinners as any}
          screenWidth={screenWidth}
        />
      )}
    </div>
  );
}
