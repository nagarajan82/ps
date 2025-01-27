import { Route, Routes } from "react-router-dom";
import { Fantasy } from "./pages/Fantasy";
import { Home } from "./pages/Home";
import "./index.css";

//pages
import { Nav } from "./components/Nav";
import { About } from "./pages/About";
import { Header } from "./components/Header";
import { RaceSchedulePage } from "./pages/RaceSchedule";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Standings } from "./pages/Standings";
import { useEffect, useState } from "react";
import { RaceResultsPage } from "./pages/RaceResults";

library.add(fas);

const App: React.FC = () => {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      {screenWidth <= 450 ? (
        <></> //custom mobile nav header inside MobileNav
      ) : (
        <Header />
      )}
      {/* <Header /> */}
      <div className={`${screenWidth <= 450 ? "flex flex-col" : "flex"}`}>
        <Nav screenWidth={screenWidth} />
        <main className={`${screenWidth <= 450 ? "main-mobile" : "main"}`}>
          <Routes>
            <Route path="/" element={<Home screenWidth={screenWidth} />} />
            <Route path="/home" element={<Home screenWidth={screenWidth} />} />
            <Route
              path="/standings"
              element={<Standings screenWidth={screenWidth} />}
            />
            <Route
              path="/schedule"
              element={<RaceSchedulePage screenWidth={screenWidth} />}
            />
            <Route
              path="/race-results"
              element={<RaceResultsPage screenWidth={screenWidth} />}
            />
            <Route
              path="/fantasy"
              element={<Fantasy screenWidth={screenWidth} />}
            />
            {/* <Route path="/historical" element={<Historical />} /> */}
            <Route
              path="/about"
              element={<About screenWidth={screenWidth} />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
