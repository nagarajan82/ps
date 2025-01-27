import { getCurrentDriverStandings } from "../../hooks/getCurrentDriverStandings";
import { FantasyMainScoreboardWidget } from "../../widgets/Fantasy/FantasyMainScoreboardWidget";
import { FantasyMainScoreboardWidgetMobile } from "../../widgets/Fantasy/FantasyMainScoreboardWidgetMobile";

interface driverData {
  driverStandings: DriverStandings[];
}

interface DriverStandings {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    permanentNumber: string;
    code: string;
    url: string;
    givenName: string;
    familyName: string;
    dateOfBirth: Date;
    nationality: string;
  };
  Constructors: [
    {
      constructorId: string;
      url: string;
      name: string;
      nationality: string;
    }
  ];
}
type ScreenWidthProps = {
  screenWidth: number;
};

export function FantasyMainScoreboard({ screenWidth }: ScreenWidthProps) {
  const [loading, driverStandings, error, request] = getCurrentDriverStandings({
    method: "get",
    url: "https://ergast.com/api/f1/2023/driverStandings.json",
  });
  // console.log(driverStandings);
  // console.log(loading, driverStandings, error, request);
  if (loading) {
    return (
      <div className="ml-2 mb-10">
        <h1 className="text-2xl font-bold mb-4">Main Scoreboard</h1>
        <p>Loading...</p>
      </div>
    );
  }
  if (error !== "") {
    return (
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-4">Main Scoreboard</h1>
        <p>{error}</p>
      </div>
    );
  }
  if (!driverStandings) {
    return (
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-4">Main Scoreboard</h1>
        <p>Data is null</p>
      </div>
    );
  }

  return (
    <>
      {screenWidth <= 1200 ? (
        <div className="mb-10 mx-auto">
          <h1 className="text-2xl font-bold ml-2">Main Scoreboard</h1>
          <div className="mt-2">
            <FantasyMainScoreboardWidgetMobile
              driverData={driverStandings as any}
            />
          </div>
        </div>
      ) : (
        <div className="w-min my-6">
          <h1 className="text-2xl font-bold mb-2">Main Scoreboard</h1>
          <div className="bg-neutral-100 pt-2 rounded-2xl border-red-500 border-4">
            <FantasyMainScoreboardWidget driverData={driverStandings as any} />
          </div>
        </div>
      )}
    </>
  );
}
