type ScreenWidthProps = {
  screenWidth: number;
};

export function About({ screenWidth }: ScreenWidthProps) {
  // const test: [] | undefined = driverStandings;
  return (
    <div className={`${screenWidth <= 450 ? "pt-10" : ""}`}>
      <div className={`${screenWidth <= 450 ? "m-4" : "m-10 max-w-4xl"}`}>
        <h1 className="text-3xl font-bold">About</h1>
        <p className="my-4 ">
          This <span className="italic">currently front end focused</span> React
          app, utilizing Typescript, Tailwind, and Ergast API offers a data
          heavy dashboard of Formula 1 information so the user can track their
          predictions as the season unfolds. Updated with race results, weather,
          and more from multiple APIs.
          <br />
          <br />
          As an avid Formula 1 fan, my friends and I wanted an all inclusive F1
          web app that includes our season's predictions, current season stats
          and more.
        </p>
        <h2 className="text-xl font-bold">Current Season</h2>
        <p className="my-4">
          As the season unfolds each week, the current season section will be
          updated with the race results, track information and more. The user
          can sort, filter and manipulate the data to gain knowledge about a
          certain driver, constructor or track.
        </p>
        <h2 className="text-xl font-bold">Fantasy</h2>
        <p className="my-4">
          The Fantasy section shows the involved player's season predictions
          over multiple charts and data tables. The user can sort, filter and
          manipulate the data to better understand their position among their
          peers. This is updated live with the current season's data via the
          Ergast API and more.
        </p>
        <h2 className="text-xl font-bold">Historical Data</h2>
        <p>
          This section will allow the user to query historical data about
          drivers, constructors, race tracks, and more. YET TO BE BUILT.
        </p>
        <div className="mt-10">
          <h3 className="text-xl font-bold">Product Roadmap</h3>
          <ul className="ml-10">
            <li className="list-decimal">
              <a
                href="./"
                className="block w-max text-lg cursor-pointer rounded-lg p-2 hover:underline"
              >
                Home
              </a>
              <ul className="ml-10">
                <li className="list-disc p-2">
                  <span className="font-bold">Top 3 Fantasy: </span>
                  <s>show top 3 statically</s>, show dyanmically based off
                  leader points?
                </li>
                <li className="list-disc p-2">
                  <span className="font-bold">Next Race: </span>
                  <s>countdown, grand prix times, weather</s>
                </li>
                <li className="list-disc p-2">
                  <span className="font-bold">Other: </span>
                  what else can the space be filled with?
                </li>
              </ul>
            </li>
            <li className="list-decimal">
              <a
                href="./current"
                className="block w-max cursor-pointer text-lg rounded-lg p-2 hover:underline"
              >
                Current Season
              </a>
              <ul className="ml-10">
                <li className="list-disc p-2">
                  <span className="font-bold">Driver Info: </span>
                  <s>pts, wins, poles, DOTD</s>
                </li>
                <li className="list-disc p-2">
                  <span className="font-bold">Constructor Info:</span> pit stop
                  time info by race (#, time by driver, etc), <s>wins, poles</s>
                  , ++
                </li>
                <li className="list-disc p-2">
                  <span className="font-bold">Track Info: </span>
                  <s>combined w/ Race Schedule</s>
                </li>
                <li className="list-disc p-2">
                  <span className="font-bold">Race Schedule: </span>{" "}
                  <s>
                    upcoming sessions for practices, qualifying, sprint races
                    and main race, weather,
                  </s>{" "}
                  ++
                </li>
                <li className="list-disc p-2">
                  <span className="font-bold">Overview:</span> race by race info
                  on drivers and constructors like driver reaction times, driver
                  history at each track, constructor info ++
                </li>
              </ul>
            </li>

            <li className="list-decimal">
              <a
                href="./fantasy"
                className="block w-max text-lg cursor-pointer rounded-lg p-2 hover:underline"
              >
                Fantasy
              </a>
              <ul className="ml-10">
                <li className="list-disc p-2">
                  <span className="font-bold">Main Predictions:</span>{" "}
                  <s>player by each group of drivers, total points</s>
                </li>
                <li className="list-disc p-2">
                  <span className="font-bold">Prop Bets:</span>
                  <br />
                  Done:{" "}
                  <s>
                    Top constructor, Bottom constructor, Most DNFs, Most Poles,
                    Most Fastest Laps, Most Driver of the Day
                  </s>
                  <br />
                  To Do: non-manual pulls for FL & DOTD
                </li>
              </ul>
            </li>
            <li className="list-decimal">
              <a
                href="./"
                className="block w-max text-lg cursor-pointer rounded-lg p-2 hover:underline"
              >
                Historical Data
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
