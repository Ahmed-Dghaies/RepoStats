import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchAllCommits } from "../../features/commits/services/commits";
import { setRepository } from "../../features/repository/reducers/repositoryReducer";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedRepository = useAppSelector((state) => state.repository);

  useEffect(() => {
    if (selectedRepository.name === "" && selectedRepository.owner === "") {
      dispatch(setRepository({ name: "cli", owner: "cli" }));
    }
  }, [dispatch, selectedRepository]);

  useEffect(() => {
    dispatch(fetchAllCommits());
  }, [selectedRepository, dispatch]);

  return <div className="grow overflow-x-hidden overflow-y-auto p-5">Home</div>;
};

export default Home;
