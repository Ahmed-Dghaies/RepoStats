import { configureStore } from "@reduxjs/toolkit";
import commitsReducer from "./features/commits/reducers/commitsReducer";
import repositoriesReducer from "./features/repositories/reducers/repositoriesReducer";

export const store = configureStore({
  reducer: {
    commits: commitsReducer,
    repositories: repositoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
