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

export const base64ToMarkdown = (base64String: string) => {
  const decodedText = atob(base64String); // Decode Base64
  return decodedText; // This is the Markdown content
};

export const isErrorResponse = (result: any): result is { status: number; message: string } => {
  return "status" in result && "message" in result;
};

export const handleErrors = <T>(error: any): Result<T> => {
  if (error.response) {
    return { status: error.response.status, message: error.response.statusText };
  }
  return { status: 500, message: "Internal Server Error" };
};
