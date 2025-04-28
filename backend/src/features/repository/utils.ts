import { Result } from "../../types/repository";

export const formatRepositorySize = (size: number) => {
  const units = ["KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  while (size >= 1024) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

export const base64ToMarkdown = (base64String: string): string => {
  try {
    return Buffer.from(base64String, "base64").toString("utf8");
  } catch (error) {
    throw new Error(`Failed to decode Base64 string: ${error.message}`);
  }
};
