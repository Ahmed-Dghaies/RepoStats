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
