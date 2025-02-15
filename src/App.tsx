import React from "react";
import { Routes, Route } from "react-router-dom";

import "react-tooltip/dist/react-tooltip.css";
import "./App.css";

import Navbar from "./components/navbar";
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
    <>
      <Navbar />
      <Routes>
        {MultiRoute(<Home />, ["/", "/home"])}
        <Route path="stats" element={<Stats />} />
        <Route path="/repository/:owner/:repository" element={<RepoStats />} />
        {MultiRoute(<NotFound />, ["/404", "*"])}
      </Routes>
      <Tooltip id="global-tooltip" className="z-50 tooltip-container" />
    </>
  );
};

export default App;
