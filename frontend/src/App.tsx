import React from "react";
import { Routes, Route } from "react-router-dom";

import "react-tooltip/dist/react-tooltip.css";
import "@/assets/styles/globalStyles.css";
import "./App.css";

import Navbar from "@/components/Navbar";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Stats from "./pages/Stats";
import { Tooltip } from "react-tooltip";
import RepoStats from "./pages/RepoStats";

const App: React.FC = () => {
  function MultiRoute(el: JSX.Element, paths: string[]): JSX.Element[] {
    return paths.map((p) => <Route key={p} element={el} path={p} />);
  }

  return (
    <div className="flex flex-col min-h-screen h-full">
      <Navbar />
      <div className="flex-grow p-4 overflow-y-auto mr-1 pr-3">
        <Routes>
          {MultiRoute(<Home />, ["/", "/home"])}
          <Route path="stats" element={<Stats />} />
          <Route path="/repository/:owner/:name" element={<RepoStats />} />
          {MultiRoute(<NotFound />, ["/404", "*"])}
        </Routes>
        <Tooltip id="global-tooltip" className="z-50 tooltip-container" />
      </div>
    </div>
  );
};

export default App;
