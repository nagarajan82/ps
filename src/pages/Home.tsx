import { FantasyMainScoreboardLeader } from "../components/FantasyScoreboards/FantasyMainScoreboardLeader";
import { CurrentDriverStandingsHome } from "../components/Home/CurrentDriverStandingsHome";
import { getRaceSchedule } from "../hooks/getRaceSchedule";
import { NextRaceDetailedWidget } from "../widgets/HomeWidgets/NextRaceDetailedWidget";
import { RecentNotesWidget } from "../widgets/HomeWidgets/RecentNotesWidget";

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

type ScreenWidthProps = {
  screenWidth: number;
};

export function Home({ screenWidth }: ScreenWidthProps) {
  const [loading, raceSchedule, error, request] = getRaceSchedule({
    method: "get",
    url: "https://ergast.com/api/f1/current.json",
  });

  if (loading) {
    return (
      <div className="home-mobile m-4">
        <h1 className="text-2xl font-bold mb-2">Welcome!</h1>
      </div>
    );
  }
  if (error !== "") {
    return <p>{error}</p>;
  }
  if (!raceSchedule) {
    return <p>Data is null</p>;
  }

  return (
    <>
      {screenWidth <= 768 ? (
        <div className="home-mobile m-4">
          <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
          <FantasyMainScoreboardLeader screenWidth={screenWidth} />
          <RecentNotesWidget />
          <NextRaceDetailedWidget
            raceSchedule={raceSchedule as any}
            screenWidth={screenWidth}
          />
        </div>
      ) : (
        <div className="home m-6 max-w-7xl">
          <h1 className="text-3xl font-bold mb-4">Welcome!</h1>
          <FantasyMainScoreboardLeader screenWidth={screenWidth} />
          <RecentNotesWidget />
          <div className="flex flex-wrap gap-4 justify-between">
            <NextRaceDetailedWidget
              raceSchedule={raceSchedule as any}
              screenWidth={screenWidth}
            />
            <CurrentDriverStandingsHome />
          </div>
        </div>
      )}
    </>
  );
}
