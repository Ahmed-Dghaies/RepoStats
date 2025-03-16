import { GraphStep } from "@/types/graphs";

export function formatDateLabelByStep(timestamp: string, step: GraphStep): string {
  const date = new Date(timestamp);

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
