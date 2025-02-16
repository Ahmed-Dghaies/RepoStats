import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Repository } from "../../../types/repository";

interface RepositoriesState {
  repositoriesList: Repository[];
  selectedRepository: Repository;
}

const initialState: RepositoriesState = {
  repositoriesList: [],
  selectedRepository: {
    name: "",
    owner: "",
    lastUpdated: "",
    url: "",
  },
};

const repositorySlice = createSlice({
  name: "repository",
  initialState,
  reducers: {
    setRepositories: (state, action: PayloadAction<Array<Repository>>) => {
      state.repositoriesList = action.payload;
    },
    setSelectedRepository: (state, action: PayloadAction<Repository>) => {
      state.selectedRepository = action.payload;
    },
    resetState: () => initialState,
  },
});

export const { setSelectedRepository, setRepositories, resetState } =
  repositorySlice.actions;

export default repositorySlice.reducer;
