import { formatRepositorySize, base64ToMarkdown, locateDependencyFile } from "../utils";

describe("Utility Functions", () => {
  describe("formatRepositorySize", () => {
    const testCases = [
      { input: 0, expected: "0.00 KB" },
      { input: 500, expected: "500.00 KB" },
      { input: 1024, expected: "1.00 MB" },
      { input: 1536, expected: "1.50 MB" },
      { input: 1024 * 1024, expected: "1.00 GB" },
      { input: 2.5 * 1024 * 1024, expected: "2.50 GB" },
      { input: 1024 * 1024 * 1024, expected: "1.00 TB" },
    ];

    test.each(testCases)("converts $input bytes to $expected", ({ input, expected }) => {
      expect(formatRepositorySize(input)).toBe(expected);
    });
  });

  describe("base64ToMarkdown", () => {
    it("decodes valid base64 strings", () => {
      const testString = "### Markdown Header\n\nSome content";
      const base64String = Buffer.from(testString).toString("base64");
      expect(base64ToMarkdown(base64String)).toBe(testString);
    });

    it("returns empty string for empty input", () => {
      expect(base64ToMarkdown("")).toBe("");
    });

    it("handles special characters", () => {
      const testString = "äöüß©®™";
      const base64String = Buffer.from(testString).toString("base64");
      expect(base64ToMarkdown(base64String)).toBe(testString);
    });
  });

  describe("locateDependencyFile", () => {
    const defaultExpectation = {
      node: "package.json",
      python: null,
      php: "composer.json",
      rust: "Cargo.toml",
      go: "go.mod",
      "c++": null,
    };

    it("returns defaults for empty array", () => {
      expect(locateDependencyFile([])).toEqual(defaultExpectation);
    });

    it("finds all dependency files", () => {
      const files = [
        "package.json",
        "requirements.txt",
        "composer.json",
        "Cargo.toml",
        "go.mod",
        "CMakeLists.txt",
      ];
      expect(locateDependencyFile(files)).toEqual({
        ...defaultExpectation,
        python: "requirements.txt",
        "c++": "CMakeLists.txt",
      });
    });

    it("prefers requirements.txt over pyproject.toml", () => {
      expect(locateDependencyFile(["requirements.txt", "pyproject.toml"]).python).toBe(
        "requirements.txt"
      );
    });

    it("finds C++ source files when no CMakeLists.txt", () => {
      const result = locateDependencyFile(["main.cpp", "header.h"]);
      expect(result["c++"]).toMatch(/\.(cpp|h)$/);
    });

    it("is case sensitive", () => {
      expect(locateDependencyFile(["PACKAGE.JSON"]).node).toBe("package.json");
    });
  });
});
