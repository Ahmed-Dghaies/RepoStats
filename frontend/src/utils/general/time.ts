import { GraphStep } from "@/types/graphs";

/**
 * Formats a timestamp string into a date label based on the specified graph step.
 *
 * @param timestamp - The date and time as an ISO string or similar format.
 * @param step - The granularity for formatting, such as "hour", "day", "week", "month", or "year".
 * @returns A formatted date label appropriate for the given {@link step}, or an empty string if the timestamp is invalid.
 */
export function formatDateLabelByStep(timestamp: string, step: GraphStep): string {
  const date = new Date(timestamp);

  if (isNaN(date.getTime())) {
    return "";
  }

  switch (step) {
    case "hour":
      return `${date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
      })} ${date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    case "day":
    case "week":
      return date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
      });
    case "month":
      return date.toLocaleDateString(undefined, {
        month: "2-digit",
        year: "numeric",
      });
    case "year":
      return date.getFullYear().toString();
    default:
      return date.toLocaleDateString();
  }
}
