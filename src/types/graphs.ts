import { ApexOptions } from "apexcharts";

export interface graphData {
  name: string;
  data: number[];
}

export interface formattedGraphData {
  data: ApexOptions["series"];
  keys: string[];
  maximumValue: number;
}

export enum GraphStep {
  hour = "hour",
  day = "day",
  week = "week",
  month = "month",
  year = "year",
}
