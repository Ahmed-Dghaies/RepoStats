import { ApexOptions } from "apexcharts";

export interface GraphData {
  name: string;
  data: number[];
}

export interface FormattedGraphData {
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
