import React from "react";
import RepositoriesTable from "@/features/repositories/components/RepositoriesTable";

const Home: React.FC = () => {
  return (
    <div className="grow overflow-x-hidden overflow-y-auto p-4">
      <RepositoriesTable />
    </div>
  );
};

export default Home;
