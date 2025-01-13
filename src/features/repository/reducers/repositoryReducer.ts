import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RepositoryState {
  name: string;
  owner: string;
}

const initialState: RepositoryState = {
  name: "",
  owner: "",
};

const repositorySlice = createSlice({
  name: "repository",
  initialState,
  reducers: {
    setRepository: (
      state,
      action: PayloadAction<Record<"name" | "owner", string>>
    ) => {
      state.name = action.payload.name;
      state.owner = action.payload.owner;
    },
    resetState: () => initialState,
  },
});

export const { setRepository, resetState } = repositorySlice.actions;

export default repositorySlice.reducer;
