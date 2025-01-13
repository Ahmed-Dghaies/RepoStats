import { configureStore } from "@reduxjs/toolkit";
import commitsReducer from "./features/commits/reducers/commitsReducer";
import repositoryReducer from "./features/repository/reducers/repositoryReducer";

export const store = configureStore({
  reducer: {
    commits: commitsReducer,
    repository: repositoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
