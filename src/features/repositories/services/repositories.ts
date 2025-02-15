import GitHub, { getHeaders } from "@/utils/axios/axios";
import { AppDispatch } from "../../../store";
import { Repository } from "@/types/repository";
import { setRepositories } from "../reducers/repositoriesReducer";
import {
  formatClonesData,
  formatGraphViewsData,
  formatPunchCardData,
} from "@/utils/graphs/lineGraph";
import { formattedGraphData, graphData } from "@/types/graphs";

export const fetchAllRepositories = () => async (dispatch: AppDispatch) => {
  const result: Array<Repository> = JSON.parse(
    localStorage.getItem("repositories") ?? "[]"
  );
  dispatch(setRepositories(result));
};

interface formattedGraphComparisonData {
  keys: string[];
  maximumValue: number;
  count: graphData;
  uniquesCount: graphData;
}

export const fetchClonesStatistics = async ({
  owner,
  name,
}: Partial<Repository>): Promise<formattedGraphComparisonData> => {
  const headers = getHeaders();
  console.log(headers);
  const result = await GitHub.get(
    `/repos/${owner}/${name}/traffic/clones`,
    headers
  )
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      console.log(error);
      return [];
    });
  return formatClonesData(result);
};

export const fetchRepositoryViews = async ({
  owner,
  name,
}: Partial<Repository>): Promise<formattedGraphComparisonData> => {
  const headers = getHeaders();
  const result = await GitHub.get(
    `/repos/${owner}/${name}/traffic/views`,
    headers
  )
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      console.log(error);
      return [];
    });
  return formatGraphViewsData(result);
};

export const fetchRepositoryPunchCard = async ({
  owner,
  name,
}: Partial<Repository>): Promise<formattedGraphData> => {
  const headers = getHeaders();
  const result = await GitHub.get(
    `/repos/${owner}/${name}/stats/punch_card`,
    headers
  )
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      console.log(error);
      return [];
    });
  return formatPunchCardData(result);
};
