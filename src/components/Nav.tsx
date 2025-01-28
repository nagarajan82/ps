import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type ScreenWidthProps = {
  screenWidth: number;
};

export function Nav({ screenWidth }: ScreenWidthProps) {
  const [isCurrentOpen, setIsCurrentOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("current");
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      setActiveNav("home");
    } else if (location.pathname === "/home") {
      setActiveNav("home");
    } else if (location.pathname === "/current") {
      setActiveNav("current");
    } else if (location.pathname === "/standings") {
      setActiveNav("standings");
    } else if (location.pathname === "/schedule") {
      setActiveNav("schedule");
    } else if (location.pathname === "/race-results") {
      setActiveNav("race-results");
    } else if (location.pathname === "/fantasy") {
      setActiveNav("fantasy");
    } else if (location.pathname === "/historical") {
      setActiveNav("historical");
    } else if (location.pathname === "/about") {
      setActiveNav("about");
    }
  }, [location]);
  return (
    <>
      {screenWidth <= 768 ? (
        <nav
          className={
            isMobileOpen
              ? "mobile-nav mx-auto flex flex-col h-full"
              : "mobile-nav mx-auto flex flex-col"
          }
        >
          <header className="mobile-header w-full flex items-center justify-between px-4">
            <div className="text-white text-2xl font-thin w-max">
              <Link to="/">
                <span className="font-bold">ABC Race </span>Company
              </Link>
            </div>
            {/* Hamburger menu */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-f1-yellow focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </header>
          <div className={isMobileOpen ? "flex h-full" : "hidden"}>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="w-1/3 mr-auto bg-black opacity-50 cursor-default"
            ></button>
            <div className="w-2/3 ml-auto h-full">
              <ul className="flex flex-col justify-between text-md m-4">
                <li className="mb-2">
                  <Link
                    to="/"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className={`block rounded-xl py-3 pl-4 ${
                      activeNav === "home" ? "active" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon="house" className="pr-2" />
                    Home
                  </Link>
                </li>
                <li className="mb-2">
                  <button
                    onClick={() => setIsCurrentOpen(!isCurrentOpen)}
                    className="relative w-full rounded-xl py-3 pl-4 text-left"
                  >
                    <FontAwesomeIcon icon="stream" className="pr-2" />
                    Current season
                    <FontAwesomeIcon
                      icon={isCurrentOpen ? "caret-up" : "caret-down"}
                      className={
                        isCurrentOpen
                          ? "absolute right-4 bottom-3.5"
                          : "absolute right-4 bottom-4"
                      }
                    />
                  </button>
                  {isCurrentOpen && (
                    <ul className="pl-6">
                      <li className="my-2">
                        <Link
                          to="/standings"
                          onClick={() => setIsMobileOpen(!isMobileOpen)}
                          className={`block rounded-xl py-3 pl-4 ${
                            activeNav === "standings" ? "active" : ""
                          }`}
                        >
                          <FontAwesomeIcon
                            icon="trophy"
                            className="pr-2 w-[18px]"
                          />
                          Standings
                        </Link>
                      </li>
                      <li className="my-2">
                        <Link
                          to="/schedule"
                          onClick={() => setIsMobileOpen(!isMobileOpen)}
                          className={`block rounded-xl py-3 pl-4 ${
                            activeNav === "schedule" ? "active" : ""
                          }`}
                        >
                          <FontAwesomeIcon
                            icon="calendar"
                            className="pr-2 w-[18px]"
                          />
                          Schedule
                        </Link>
                      </li>
                      <li className="">
                        <Link
                          to="/race-results"
                          onClick={() => setIsMobileOpen(!isMobileOpen)}
                          className={`block rounded-xl py-3 pl-4 ${
                            activeNav === "race-results" ? "active" : ""
                          }`}
                        >
                          <FontAwesomeIcon
                            icon="flag-checkered"
                            className="pr-2 w-[18px]"
                          />
                          Race results
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li className="mb-2">
                  <Link
                    to="/fantasy"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className={`block rounded-xl py-3 pl-4 ${
                      activeNav === "fantasy" ? "active" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon="chart-column" className="pr-2" />
                    Fantasy
                  </Link>
                  {/* &#8595; */}
                </li>                
              </ul>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="main-nav">
          <ul className="flex flex-col justify-between text-md m-4">
            <li className="mb-2">
              <Link
                to="/"
                className={`block rounded-xl py-3 pl-4 ${
                  activeNav === "home" ? "active" : ""
                }`}
              >
                <FontAwesomeIcon icon="house" className="pr-2" />
                Home
              </Link>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setIsCurrentOpen(!isCurrentOpen)}
                className="relative w-full rounded-xl py-3 pl-4 text-left"
              >
                <FontAwesomeIcon icon="stream" className="pr-2" />
                Current season
                <FontAwesomeIcon
                  icon={isCurrentOpen ? "caret-up" : "caret-down"}
                  className={
                    isCurrentOpen
                      ? "absolute right-4 bottom-3.5"
                      : "absolute right-4 bottom-4"
                  }
                />
              </button>
              {isCurrentOpen && (
                <ul className="pl-6">
                  <li className="my-2">
                    <Link
                      to="/standings"
                      className={`block rounded-xl py-3 pl-4 ${
                        activeNav === "standings" ? "active" : ""
                      }`}
                    >
                      <FontAwesomeIcon icon="trophy" className="pr-2" />
                      Standings
                    </Link>
                  </li>
                  <li className="my-2">
                    <Link
                      to="/schedule"
                      className={`block rounded-xl py-3 pl-4 ${
                        activeNav === "schedule" ? "active" : ""
                      }`}
                    >
                      <FontAwesomeIcon icon="calendar" className="pr-2" />
                      Race schedule
                    </Link>
                  </li>
                  <li className="">
                    <Link
                      to="/race-results"
                      onClick={() => setIsMobileOpen(!isMobileOpen)}
                      className={`block rounded-xl py-3 pl-4 ${
                        activeNav === "race-results" ? "active" : ""
                      }`}
                    >
                      <FontAwesomeIcon icon="flag-checkered" className="pr-2" />
                      Race results
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="mb-2">
              <Link
                to="/fantasy"
                className={`block rounded-xl py-3 pl-4 ${
                  activeNav === "fantasy" ? "active" : ""
                }`}
              >
                <FontAwesomeIcon icon="chart-column" className="pr-2" />
                Fantasy
              </Link>
              {/* &#8595; */}
            </li>           
          </ul>
        </nav>
      )}
    </>
  );
}
