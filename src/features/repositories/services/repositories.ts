import { AppDispatch } from "../../../store";
import { Repository } from "../../../types/repository";
import { setRepositories } from "../reducers/repositoriesReducer";

export const fetchAllRepositories = () => async (dispatch: AppDispatch) => {
  const result: Array<Repository> = JSON.parse(
    localStorage.getItem("repositories") ?? "[]"
  );
  dispatch(setRepositories(result));
};
