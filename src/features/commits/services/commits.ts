import { setCommits } from "../reducers/commitsReducer";
import { AppDispatch, RootState } from "../../../store";
import GitHub, { getHeaders } from "../../../utils/axios/axios";

export const fetchAllCommits =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const headers = getHeaders();
    const selectedRepo = getState().repository;
    const { startDate, endDate, commitsPerPage, currentPage } =
      getState().commits;
    let queryParams: string = `?since=${startDate}&until=${endDate}`;
    if (commitsPerPage) {
      queryParams += `&per_page=${commitsPerPage}`;
      if (currentPage) {
        queryParams += `&page=${currentPage}`;
      }
    }
    const result = await GitHub.get(
      `/repos/${selectedRepo.owner}/${selectedRepo.name}/commits${queryParams}`,
      headers
    )
      .then((response: any) => {
        return response.data.map((commit: any) => {
          return {
            id: commit.sha,
            author: commit.commit.author.name,
            date: commit.commit.author.date,
          };
        });
      })
      .catch((error: any) => {
        console.log(error);
        return [];
      });
    dispatch(setCommits(result));
  };
