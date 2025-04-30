import { fetchHeatMapData } from "@/features/repositories/services/repositories";
import { useEffect, useState } from "react";

interface HeatMapDetails {
  data: {
    date: string;
    count: number;
  }[];
  startDate: Date;
  endDate: Date;
  maximumValue: number;
}

interface UseRepositoryHeatMapProps {
  owner: string | undefined;
  repository: string | undefined;
}

const useRepositoryHeatMap = ({
  owner,
  repository,
}: UseRepositoryHeatMapProps): { heatMapDetails: HeatMapDetails; isLoading: boolean } => {
  const EIGHT_MONTHS = 240 * 24 * 60 * 60 * 1000;
  const [isLoading, setIsLoading] = useState(false);
  const [heatMapDetails, setHeatMapDetails] = useState<HeatMapDetails>({
    data: [],
    startDate: new Date(new Date().getTime() - EIGHT_MONTHS),
    endDate: new Date(),
    maximumValue: 0,
  });

  useEffect(() => {
    if (!owner || !repository) return;
    setIsLoading(true);
    const fetchStats = async () => {
      const { data, maximumValue } = await fetchHeatMapData({ owner, repository });
      setHeatMapDetails((prev) => ({
        ...prev,
        data,
        maximumValue,
      }));
      setIsLoading(false);
    };

    fetchStats();
  }, [owner, repository]);

  return { heatMapDetails, isLoading };
};

export default useRepositoryHeatMap;
