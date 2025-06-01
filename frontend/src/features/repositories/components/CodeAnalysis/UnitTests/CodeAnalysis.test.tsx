import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import CodeAnalysis from "../CodeAnalysis";
import { runStaticAnalysis } from "../../../services/repositories";
import { RepositoryInfo } from "@/types/repository";
import "@testing-library/jest-dom/vitest";

// Mock the Semgrep analysis service
vi.mock("../../../services/repositories", () => ({
  runStaticAnalysis: vi.fn(),
}));

const mockRepositoryDetails: RepositoryInfo = {
  name: "example-repo",
  owner: { login: "example-owner", avatarUrl: "", contributions: 0 },
  fullName: "example-owner/example-repo",
  defaultBranch: "main",
  stars: 0,
  license: "",
  description: "",
  releases: { latestRelease: { tagName: "", releaseDate: "" }, nbReleases: 0 },
  forkCount: 0,
  watchersCount: 0,
  size: "",
  languages: {},
  openIssues: 0,
  createdAt: "",
  updatedAt: "",
  readme: "",
  projectType: "",
  dependencyFile: "",
};

describe("CodeAnalysis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders idle state initially", () => {
    render(<CodeAnalysis repositoryDetails={mockRepositoryDetails} />);
    expect(screen.getByRole("button", { name: /Run Analysis/i })).toBeInTheDocument();
  });

  it("shows loading state while running", async () => {
    (runStaticAnalysis as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(() => {}) // never resolves
    );

    render(<CodeAnalysis repositoryDetails={mockRepositoryDetails} />);
    fireEvent.click(screen.getByRole("button", { name: /Run Analysis/i }));

    expect(await screen.findByText(/Cloning repository/)).toBeInTheDocument();
  });

  it("shows error state on failure", async () => {
    (runStaticAnalysis as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Something went wrong")
    );

    render(<CodeAnalysis repositoryDetails={mockRepositoryDetails} />);
    fireEvent.click(screen.getByRole("button", { name: /Run Analysis/i }));

    await waitFor(() => {
      expect(screen.getByText(/Analysis Failed/)).toBeInTheDocument();
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });

  it("displays findings on success", async () => {
    (runStaticAnalysis as ReturnType<typeof vi.fn>).mockResolvedValue({
      results: [
        {
          check_id: "rule.security.issue",
          extra: {
            severity: "ERROR",
            message: "Critical issue found",
            metadata: { category: "Security" },
          },
          path: "src/index.js",
          start: { line: 10, col: 5 },
        },
      ],
      errors: [],
    });

    render(<CodeAnalysis repositoryDetails={mockRepositoryDetails} />);
    fireEvent.click(screen.getByRole("button", { name: /Run Analysis/i }));

    await waitFor(() => {
      expect(screen.getByText(/Analysis Complete/)).toBeInTheDocument();
      expect(screen.getByText(/rule.security.issue/)).toBeInTheDocument();
      expect(screen.getByText(/Critical issue found/)).toBeInTheDocument();
    });
  });

  it("shows 'no issues' message when no findings", async () => {
    (runStaticAnalysis as ReturnType<typeof vi.fn>).mockResolvedValue({
      results: [],
      errors: [],
    });

    render(<CodeAnalysis repositoryDetails={mockRepositoryDetails} />);
    fireEvent.click(screen.getByRole("button", { name: /Run Analysis/i }));

    await waitFor(() => {
      expect(screen.getByText(/No issues found/)).toBeInTheDocument();
    });
  });
});
