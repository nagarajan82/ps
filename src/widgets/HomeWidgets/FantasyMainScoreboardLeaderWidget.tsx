import fantasy from "../../data/fantasy.json";
import headerImg from "../../assets/img/marcel-heil-bJaMVy23gvc-unsplash.jpg";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type allProps = {
  driverData: [];
  screenWidth: number;
};

type newPlayerArrayType = {
  name: string;
  nickName: string;
  totalPoints: number;
  drivers: {
    driverName: string;
    driverCode: string;
    driverPoints: number;
  };
};

export function FantasyMainScoreboardLeaderWidget({
  driverData,
  screenWidth,
}: allProps) {
  const newDriverArray = driverData.map((value) => {
    return {
      code: value["Driver"]["code"],
      points: value["points"],
    };
  });

  function getDriverPoints(driverCode: string) {
    // get driverID from driverInfo data based off of input
    let playerDriverPoints: number = 0;
    let points: number = 0;
    newDriverArray.find((value) => {
      if (driverCode == value.code) return (playerDriverPoints = value.points);
    });
    return +playerDriverPoints;
  }

  function sumTeamPoints(nickName: string) {
    let sum = 0;
    fantasy.filter((value) => {
      // find nickName's drivers
      if (nickName === value.nickName) {
        //return if no match
        value.mainDrivers.map((e) => {
          //iterate over drivers and add points to sum
          sum += getDriverPoints(e.code);
        });
      }
    });
    return sum;
  }

  const newPlayerArray = fantasy
    .map((value) => {
      return {
        name: value.name,
        nickName: value.nickName,
        drivers: value.mainDrivers.map((v) => {
          let thing = newDriverArray.find((t) => t.code == v.code);
          return {
            driverName: v.fullName,
            driverCode: v.code,
            driverPoints: thing?.points,
          };
        }),
        totalPoints: sumTeamPoints(value.nickName),
      };
    })
    .sort((a, b) => {
      return b.totalPoints - a.totalPoints;
    });
  const leader = newPlayerArray[0];
  const second = newPlayerArray[1];
  const third = newPlayerArray[2];

  return (
    <>
      {screenWidth <= 450 ? (
        <div className="home-leader-widget-mobile rounded-b-lg rounded-t-3xl">
          <img
            src={headerImg}
            alt={headerImg}
            className="object-cover rounded-t-lg"
          />
          <div className="flex items-center p-2">
            <p className="text-lg">Fantasy Top 3</p>
            <Link to="/fantasy">
              <div className="text-xs px-2">
                <FontAwesomeIcon icon="up-right-from-square" />
              </div>
            </Link>
          </div>
          <div className="flex flex-col justify-center items-center px-2 pb-4 gap-2 mx-10">
            <div className="flex text-xl text-white w-full justify-between">
              <p className="w-max font-bold">
                <span>1. </span>
                {leader.name.toUpperCase()}
              </p>
              <p className="font-bold">
                {leader.totalPoints}{" "}
                <span className="font-light text-sm">pts</span>
              </p>
            </div>
            <div className="flex text-xl text-gray-300 w-full justify-between">
              <p className="w-max">
                <span>2. </span>
                {second.name.toUpperCase()}
              </p>
              <p className="font-bold">
                {second.totalPoints}{" "}
                <span className="font-light text-sm">pts</span>
              </p>
            </div>
            <div className="flex text-xl text-gray-400 w-full justify-between">
              <p className="w-max">
                <span>3. </span>
                {third.name.toUpperCase()}
              </p>
              <p className="font-bold">
                {third.totalPoints}{" "}
                <span className="font-light text-sm">pts</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="home-leader-widget flex">
          <div className="flex flex-col items-start justify-between py-4 px-4 rounded-l-lg">
            <div className="flex items-center">
              <p className="px-2">FANTASY TOP 3</p>
              <Link to="/fantasy">
                <div className="text-sm px-2">
                  <FontAwesomeIcon icon="up-right-from-square" />
                </div>
              </Link>
            </div>
            <div className="flex text-right">
              <div className="p-2 pr-4">
                <p className="text-3xl mb-2 text-white">
                  {leader.name.toUpperCase()}
                </p>
                <p className="text-2xl mb-2 text-gray-400">
                  {second.name.toUpperCase()}
                </p>
                <p className="text-sm text-gray-500">
                  {third.name.toUpperCase()}
                </p>
              </div>
              <div className="p-2">
                <p className="text-3xl font-bold mb-2 text-white">
                  {leader.totalPoints} pts
                </p>
                <p className="text-2xl mb-2 text-gray-400">
                  {second.totalPoints} pts
                </p>
                <p className="text-sm text-gray-500">{third.totalPoints} pts</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <img src={headerImg} alt={headerImg} className="rounded-r-lg" />
          </div>
        </div>
      )}
    </>
  );
}
