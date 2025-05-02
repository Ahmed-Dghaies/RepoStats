import React from "react";
import { Routes, Route } from "react-router-dom";

import "react-tooltip/dist/react-tooltip.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "@/assets/styles/globalStyles.css";
import "./App.css";

import Navbar from "@/components/Navbar";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { Tooltip } from "react-tooltip";
import RepositoryDetails from "./pages/RepositoryDetails";
import Modal from "react-modal";

Modal.setAppElement("body");

const App: React.FC = () => {
  function MultiRoute(el: JSX.Element, paths: string[]): JSX.Element[] {
    return paths.map((p) => <Route key={p} element={el} path={p} />);
  }

  return (
    <div className="flex flex-col min-h-screen h-full">
      <Navbar />
      <div className="flex-grow overflow-y-auto">
        <Routes>
          {MultiRoute(<Home />, ["/", "/home"])}
          <Route path="/repository/:owner/:repository/*" element={<RepositoryDetails />} />
          {MultiRoute(<NotFound />, ["/404", "*"])}
        </Routes>
        <Tooltip id="global-tooltip" className="z-50 tooltip-container" />
      </div>
    </div>
  );
};

export default App;
