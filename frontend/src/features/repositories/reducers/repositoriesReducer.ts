import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Repository } from "../../../types/repository";

interface RepositoriesState {
  repositoriesList: Repository[];
  selectedRepository: Repository;
}

const initialState: RepositoriesState = {
  repositoriesList: [],
  selectedRepository: {
    repository: "",
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
    deleteRepository: (state, action: PayloadAction<Repository>) => {
      const index = state.repositoriesList.findIndex(
        (repo: Repository) => repo.url === action.payload.url
      );
      if (index !== -1) {
        state.repositoriesList.splice(index, 1);
      }
    },
    refreshRepositories: (state) => {
      const items: Array<Repository> = JSON.parse(localStorage.getItem("repositories") ?? "[]");
      state.repositoriesList = items;
    },
    resetState: () => initialState,
  },
});

export const {
  setSelectedRepository,
  setRepositories,
  resetState,
  deleteRepository,
  refreshRepositories,
} = repositorySlice.actions;

export default repositorySlice.reducer;
