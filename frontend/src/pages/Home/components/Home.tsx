import React from "react";
import Repositories from "./Repositories";

const Home: React.FC = () => {
  return (
    <div className="grow overflow-x-hidden overflow-y-auto p-5">
      <Repositories />
    </div>
  );
};

export default Home;
