import React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Stats from "./pages/Stats";

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
