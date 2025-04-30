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

export const locateDependencyFile = (files: string[]): Record<string, string | null> => {
  let pythonFile: string | null = null;
  if (files.includes("requirements.txt")) {
    pythonFile = "requirements.txt";
  } else if (files.includes("pyproject.toml")) {
    pythonFile = "pyproject.toml";
  }

  let cppFile: string | null = null;
  if (files.includes("CMakeLists.txt")) {
    cppFile = "CMakeLists.txt";
  } else {
    cppFile = files.find((f: string) => f.endsWith(".cpp") || f.endsWith(".h")) ?? null;
  }

  return {
    node: "package.json",
    python: pythonFile,
    php: "composer.json",
    rust: "Cargo.toml",
    go: "go.mod",
    "c++": cppFile,
  };
};
