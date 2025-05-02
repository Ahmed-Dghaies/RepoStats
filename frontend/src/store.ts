import { configureStore } from "@reduxjs/toolkit";
import repositoriesReducer from "./features/repositories/reducers/repositoriesReducer";

export const store = configureStore({
  reducer: {
    repositories: repositoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
