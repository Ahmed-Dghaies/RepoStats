import { describe, it, expect } from "vitest";
import { formatDateLabelByStep } from "../time";
import { GraphStep } from "@/types/graphs";

describe("formatDateLabelByStep", () => {
  it("formats date correctly for 'hour'", () => {
    const timestamp = "2025-02-15T12:30:00Z";
    const result = formatDateLabelByStep(timestamp, GraphStep.hour);
    expect(result).toMatch(/^\d{2}\/\d{2} \d{2}:\d{2}$/);
  });

  it("formats date correctly for 'day'", () => {
    const timestamp = "2025-02-15T12:30:00Z";
    const result = formatDateLabelByStep(timestamp, GraphStep.day);
    expect(result).toMatch(/^\d{2}\/\d{2}$/);
  });

  it("formats date correctly for 'week'", () => {
    const timestamp = "2025-02-15T12:30:00Z";
    const result = formatDateLabelByStep(timestamp, GraphStep.week);
    expect(result).toMatch(/^\d{2}\/\d{2}$/);
  });

  it("formats date correctly for 'month'", () => {
    const timestamp = "2025-02-15T12:30:00Z";
    const result = formatDateLabelByStep(timestamp, GraphStep.month);
    expect(result).toMatch(/^\d{2}\/\d{4}$/);
  });

  it("formats date correctly for 'year'", () => {
    const timestamp = "2025-02-15T12:30:00Z";
    const result = formatDateLabelByStep(timestamp, GraphStep.year);
    expect(result).toMatch(/^\d{4}$/);
  });

  it("handles invalid timestamps", () => {
    expect(() =>
      formatDateLabelByStep("invalid-date", GraphStep.day)
    ).toThrowError();
  });
});
