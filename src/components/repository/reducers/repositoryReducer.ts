import { createSlice } from "@reduxjs/toolkit";

interface repositoryState {
  name: string;
  owner: string;
}

const initialState: repositoryState = {
  name: "",
  owner: "",
};

const repositorySlice = createSlice({
  name: "repository",
  initialState,
  reducers: {
    resetState: () => initialState,
  },
});

export const { resetState } = repositorySlice.actions;

export default repositorySlice.reducer;
