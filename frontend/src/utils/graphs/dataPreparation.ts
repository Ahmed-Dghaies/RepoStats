//data preparation
import { GraphStep } from "@/types/graphs";
import { TreeNode } from "@/types/repository";
import { formatDateLabelByStep } from "@/utils/general/time";

export function createTreeStructure(
  node: TreeNode,
  prefix: string = "",
  isLast: boolean = true
): string {
  let tree = "";

  if (node.name) {
    const currentPrefix = isLast ? "└── " : "├── ";
    tree +=
      prefix + currentPrefix + (node.type === "directory" ? node.name + "/" : node.name) + "\n";
  }

  if (node.type === "directory") {
    const newPrefix = prefix + (isLast ? "    " : "│   ");
    node.children.forEach((child, index) => {
      tree += createTreeStructure(child, newPrefix, index === node.children.length - 1);
    });
  }

  return tree;
}

interface SingleDayData {
  timestamp: string;
  count: number;
  uniques: number;
}

interface CloneResponse {
  count: number;
  uniques: number;
  clones: SingleDayData[];
}

export const formatClonesData = (response: CloneResponse) => {
  const last14Days = getLastNStepsDateArray(GraphStep.day, 14);

  const { formattedData, maximumValue } = formatGitHubStats(
    response,
    "clones",
    GraphStep.day,
    last14Days
  );

  return {
    keys: last14Days,
    maximumValue,
    count: {
      name: "Clones",
      color: "#101828",
      data: formattedData.map((item) => item.count),
    },
    uniquesCount: {
      name: "Uniques clones",
      color: "#a8c0d2",
      data: formattedData.map((item) => item.uniques),
    },
  };
};

type GitHubStatsResponse = {
  count: number;
  uniques: number;
  clones?: { timestamp: string; count: number; uniques: number }[];
  views?: { timestamp: string; count: number; uniques: number }[];
};

export function getLastNStepsDateArray(step: GraphStep, nbSteps: number) {
  const now = new Date();
  const lastNSteps = Array.from({ length: nbSteps }, (_, i) => {
    const date = new Date(now);

    switch (step) {
      case GraphStep.hour:
        date.setHours(now.getHours() - i);
        break;
      case GraphStep.day:
        date.setDate(now.getDate() - i);
        break;
      case GraphStep.week:
        date.setDate(now.getDate() - i * 7);
        break;
      case GraphStep.month:
        date.setMonth(now.getMonth() - i);
        break;
      case GraphStep.year:
        date.setFullYear(now.getFullYear() - i);
        break;
    }

    return formatDateLabelByStep(date.toISOString(), step);
  }).reverse();

  return lastNSteps;
}

export function formatGitHubStats(
  response: GitHubStatsResponse,
  metric: "clones" | "views",
  step: GraphStep,
  lastNDays: string[]
) {
  let maximumValue = 0;

  const records = response[metric] ?? [];

  const dataMap = new Map(
    records.map((entry) => {
      maximumValue = Math.max(maximumValue, entry.count);
      return [
        formatDateLabelByStep(entry.timestamp, step),
        { count: entry.count, uniques: entry.uniques },
      ];
    })
  );

  const formattedData = lastNDays.map((date) => ({
    date,
    count: dataMap.get(date)?.count ?? 0,
    uniques: dataMap.get(date)?.uniques ?? 0,
  }));

  return { formattedData, maximumValue };
}

interface ViewsResponse {
  count: number;
  uniques: number;
  views: SingleDayData[];
}

export function formatGraphViewsData(response: ViewsResponse) {
  const last14Days = getLastNStepsDateArray(GraphStep.day, 14);

  const { formattedData, maximumValue } = formatGitHubStats(
    response,
    "views",
    GraphStep.day,
    last14Days
  );

  return {
    keys: last14Days,
    maximumValue,
    count: {
      name: "Views",
      color: "#101828",
      data: formattedData.map((item) => item.count),
    },
    uniquesCount: {
      name: "Uniques views",
      color: "#a8c0d2",
      data: formattedData.map((item) => item.uniques),
    },
  };
}

type PunchCardResponse = Array<Array<number>>;

/**
 * Formats punch card commit data into hourly buckets for graphing.
 *
 * Aggregates commit counts per hour from the punch card response and returns an object containing the data array, hour labels, and the maximum commit count observed in any hour.
 *
 * @param response - Array of punch card data, where each entry contains [day, hour, commit count].
 * @returns An object with hourly commit data, hour labels, and the maximum commit count.
 */
export function formatPunchCardData(response: PunchCardResponse) {
  const keys = Array.from({ length: 24 }, (_, i) => `${i}h`);
  const commitsPerHour: { [key: string]: number } = {};
  let maximumValue = 0;
  response.forEach((row) => {
    const hour = `${row[1]}h`;
    if (commitsPerHour[hour] === undefined) {
      commitsPerHour[hour] = row[2];
    } else {
      commitsPerHour[hour] += row[2];
    }
    maximumValue = Math.max(maximumValue, commitsPerHour[hour]);
  });
  return {
    data: [
      {
        name: "Commits per hour",
        color: "#101828",
        data: keys.map((hour) => commitsPerHour[hour]),
      },
    ],
    keys: keys,
    maximumValue: maximumValue,
  };
}

/**
 * Formats language usage statistics as floored percentage shares, grouping minor languages under "Others".
 *
 * Calculates each language's percentage of the total, includes languages with at least 1% share as main languages, and assigns the remaining percentage to "Others" if applicable. Returns arrays of language names and their floored percentage shares, sorted in descending order.
 *
 * @param response - An object mapping language names to their usage counts.
 * @returns An object containing `keys` (language names) and `data` (floored percentage shares).
 */
export function formatLanguagesData(response: { [key: string]: number }) {
  const total = Object.values(response).reduce((sum, value) => sum + value, 0);

  const percentages = Object.entries(response).map(([language, count]) => ({
    language,
    percentage: (count / total) * 100,
  }));

  const mainLanguages = percentages.filter((lang) => lang.percentage >= 1);

  const mainLanguagesPercentage = mainLanguages.reduce(
    (sum, lang) => sum + Math.floor(lang.percentage),
    0
  );
  const othersPercentage = 100 - mainLanguagesPercentage;

  let formattedData = mainLanguages.map((lang) => ({
    language: lang.language,
    percentage: Math.round(lang.percentage * 100) / 100,
  }));

  if (othersPercentage > 0) {
    formattedData = [
      ...formattedData,
      {
        language: "Others",
        percentage: othersPercentage,
      },
    ];
  }

  formattedData.sort((a, b) => b.percentage - a.percentage);

  const keys = formattedData.map((item) => item.language);
  const data = formattedData.map((item) => Math.floor(item.percentage));

  return {
    data,
    keys,
  };
}
