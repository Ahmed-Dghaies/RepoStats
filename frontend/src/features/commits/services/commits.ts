import { setCommits } from "../reducers/commitsReducer";
import { AppDispatch, RootState } from "../../../store";
import backendApi from "../../../utils/axios/axios";

export const fetchAllCommits = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const selectedRepo = getState().repositories.selectedRepository;
  const { startDate, endDate, commitsPerPage, currentPage } = getState().commits;
  let queryParams: string = `?since=${startDate}&until=${endDate}`;
  if (commitsPerPage) {
    queryParams += `&per_page=${commitsPerPage}`;
    if (currentPage) {
      queryParams += `&page=${currentPage}`;
    }
  }
  const result = await backendApi
    .get(`/repository/${selectedRepo.owner}/${selectedRepo.repository}/commits${queryParams}`)
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(error);
      return [];
    });
  dispatch(setCommits(result));
};
