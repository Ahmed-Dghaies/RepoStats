import { describe, it, expect, beforeEach } from "vitest";
import { formatDateLabelByStep } from "../time";
import { GraphStep } from "@/types/graphs";

describe("formatDateLabelByStep", () => {
  beforeEach(() => {
    process.env.TZ = "UTC";
  });

  it("formats date correctly for 'hour'", () => {
    const timestamp = "2025-02-15T12:30:00Z";
    const result = formatDateLabelByStep(timestamp, GraphStep.hour);
    expect(result).toBe("02/15 12:30 PM");
  });

  it("formats date correctly for 'day'", () => {
    const timestamp = "2025-02-15T12:30:00Z";
    const result = formatDateLabelByStep(timestamp, GraphStep.day);
    expect(result).toBe("02/15");
  });

  it("formats date correctly for 'week'", () => {
    const timestamp = "2025-02-15T12:30:00Z";
    const result = formatDateLabelByStep(timestamp, GraphStep.week);
    expect(result).toBe("02/15");
  });

  it("formats date correctly for 'month'", () => {
    const timestamp = "2025-02-15T12:30:00Z";
    const result = formatDateLabelByStep(timestamp, GraphStep.month);
    expect(result).toBe("02/2025");
  });

  it("formats date correctly for 'year'", () => {
    const timestamp = "2025-02-15T12:30:00Z";
    const result = formatDateLabelByStep(timestamp, GraphStep.year);
    expect(result).toBe("2025");
  });

  it("handles invalid timestamps", () => {
    const timestamp = "invalid date";
    const result = formatDateLabelByStep(timestamp, GraphStep.year);
    expect(result).toBe("");
  });
});
