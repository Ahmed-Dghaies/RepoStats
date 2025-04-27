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

interface useRepositoryHeatMapProps {
  owner: string | undefined;
  repository: string | undefined;
}

const useRepositoryHeatMap = ({ owner, repository }: useRepositoryHeatMapProps): HeatMapDetails => {
  const EIGHT_MONTHS = 240 * 24 * 60 * 60 * 1000;
  const [heatMapDetails, setHeatMapDetails] = useState<HeatMapDetails>({
    data: [],
    startDate: new Date(new Date().getTime() - EIGHT_MONTHS),
    endDate: new Date(),
    maximumValue: 0,
  });

  useEffect(() => {
    if (!owner || !repository) return;

    const fetchStats = async () => {
      const { data, maximumValue } = await fetchHeatMapData({ owner, repository });
      setHeatMapDetails((prev) => ({
        ...prev,
        data,
        maximumValue,
      }));
    };

    fetchStats();
  }, [owner, repository]);

  return heatMapDetails;
};

export default useRepositoryHeatMap;
