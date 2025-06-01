import { describe, it, expect } from "vitest";
import {
  createTreeStructure,
  formatClonesData,
  getLastNStepsDateArray,
  formatGitHubStats,
  formatGraphViewsData,
  formatPunchCardData,
} from "../dataPreparation";
import { GraphStep } from "@/types/graphs";
import { TreeItem } from "@/types/repository";
import { formatDateLabelByStep } from "@/utils/general/time";

describe("createTreeStructure", () => {
  it("should generate a correct tree structure for directories and files", () => {
    const tree: TreeItem = {
      path: "root",
      type: "tree",
      children: [
        { path: "file1.txt", type: "blob", children: [] },
        {
          path: "subdir",
          type: "tree",
          children: [{ path: "file2.txt", type: "blob", children: [] }],
        },
      ],
    };
    const result = createTreeStructure([tree]);
    expect(result).toContain("root/");
    expect(result).toContain("├── file1.txt");
    expect(result).toContain("└── subdir/");
  });
});

describe("formatClonesData", () => {
  it("should correctly format clone data", () => {
    const response = {
      count: 5,
      uniques: 3,
      clones: [
        {
          timestamp: formatDateLabelByStep(new Date().toISOString(), GraphStep.day),
          count: 5,
          uniques: 3,
        },
      ],
    };
    const result = formatClonesData(response);
    expect(result.count.data).toContain(5);
    expect(result.uniquesCount.data).toContain(3);
  });
});

describe("getLastNStepsDateArray", () => {
  it("should return an array of correctly formatted date strings", () => {
    const result = getLastNStepsDateArray(GraphStep.day, 3);
    expect(result).toHaveLength(3);
  });
});

describe("formatGitHubStats", () => {
  it("should correctly format GitHub views statistics", () => {
    const response = {
      count: 10,
      uniques: 5,
      views: [
        { timestamp: "2023-01-01", count: 10, uniques: 5 },
        { timestamp: "2023-01-02", count: 15, uniques: 8 },
      ],
    };
    const lastNDays = ["01/01", "01/02"];
    const result = formatGitHubStats(response, "views", GraphStep.day, lastNDays);
    expect(result.formattedData[0].count).toBe(10);
    expect(result.formattedData[1].count).toBe(15);
    expect(result.maximumValue).toBe(15);
  });

  it("should correctly format GitHub clones statistics", () => {
    const response = {
      count: 10,
      uniques: 5,
      clones: [
        { timestamp: "2023-01-01", count: 10, uniques: 5 },
        { timestamp: "2023-01-02", count: 15, uniques: 8 },
      ],
    };
    const lastNDays = ["01/01", "01/02"];
    const result = formatGitHubStats(response, "clones", GraphStep.day, lastNDays);
    expect(result.formattedData[0].count).toBe(10);
    expect(result.formattedData[1].count).toBe(15);
    expect(result.maximumValue).toBe(15);
  });
});

describe("formatGraphViewsData", () => {
  it("should correctly format graph views data", () => {
    const response = {
      count: 20,
      uniques: 10,
      views: [
        {
          timestamp: formatDateLabelByStep(new Date().toISOString(), GraphStep.day),
          count: 20,
          uniques: 10,
        },
      ],
    };
    const result = formatGraphViewsData(response);
    expect(result.count.data).toContain(20);
    expect(result.uniquesCount.data).toContain(10);
  });
});

describe("formatPunchCardData", () => {
  it("should correctly format punch card data", () => {
    const response = [
      [0, 12, 3],
      [0, 13, 5],
      [0, 12, 2],
    ];
    const result = formatPunchCardData(response);
    expect(result.data[0].data[12]).toBe(5);
    expect(result.data[0].data[13]).toBe(5);
  });
});
