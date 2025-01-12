import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

interface commit {
  id: string;
  author: string;
  date: string;
}
interface commitsState {
  startDate: string;
  endDate: string;
  data: Array<commit>;
  commitsPerPage: number;
  currentPage: number;
}

const initialState: commitsState = {
  startDate: moment().subtract(7, "days").format(),
  endDate: moment().format(),
  data: [],
  commitsPerPage: 100,
  currentPage: 1,
};

const commitsSlice = createSlice({
  name: "todos",
  initialState: initialState,
  reducers: {
    setDates: (
      state,
      action: PayloadAction<{ name: "startDate" | "endDate"; value: string }>
    ) => {
      state[action.payload.name] = action.payload.value;
    },
    setCommits: (state, action: PayloadAction<Array<commit>>) => {
      state.data = action.payload;
    },
    resetState: () => initialState,
  },
});

export const { setDates, resetState, setCommits } = commitsSlice.actions;
export default commitsSlice.reducer;
