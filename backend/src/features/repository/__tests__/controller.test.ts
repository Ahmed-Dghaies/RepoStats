import { UserServices } from "../../user/services";
import { RepositoryController } from "../controller";
import { RepositoryServices } from "../services";
import { Request, Response, NextFunction } from "express";

// Mock all services
jest.mock("../services");
jest.mock("../../user/services");

describe("RepositoryController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default mock request
    mockRequest = {
      params: {
        owner: "testOwner",
        repository: "testRepo",
      },
      query: {},
    };

    // Setup mock response
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    // Setup mock next function
    mockNext = jest.fn();
  });

  describe("getContributors", () => {
    it("should return contributors with user details", async () => {
      const mockContributors = [
        { login: "user1", contributions: 10, avatar_url: "avatar1" },
        { login: "user2", contributions: 5, avatar_url: "avatar2" },
      ];

      const mockUserDetails = [{ email: "user1@test.com" }, { email: "user2@test.com" }];

      (RepositoryServices.getContributors as jest.Mock).mockResolvedValue(mockContributors);
      (UserServices.getDetails as jest.Mock)
        .mockResolvedValueOnce(mockUserDetails[0])
        .mockResolvedValueOnce(mockUserDetails[1]);

      await RepositoryController.getContributors(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(RepositoryServices.getContributors).toHaveBeenCalledWith("testOwner", "testRepo");
      expect(UserServices.getDetails).toHaveBeenCalledTimes(2);
      expect(mockResponse.json).toHaveBeenCalledWith([
        {
          login: "user1",
          contributions: 10,
          avatarUrl: "avatar1",
          email: "user1@test.com",
        },
        {
          login: "user2",
          contributions: 5,
          avatarUrl: "avatar2",
          email: "user2@test.com",
        },
      ]);
    });

    it("should handle service error", async () => {
      const mockError = new Error("Service error");
      (RepositoryServices.getContributors as jest.Mock).mockRejectedValue(mockError);

      await RepositoryController.getContributors(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getHeatMapData", () => {
    it("should return heat map data", async () => {
      const mockData = { days: [{ count: 10 }] };
      (RepositoryServices.getHeatMapData as jest.Mock).mockResolvedValue(mockData);

      await RepositoryController.getHeatMapData(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(RepositoryServices.getHeatMapData).toHaveBeenCalledWith({
        owner: "testOwner",
        repository: "testRepo",
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle service error", async () => {
      const mockError = new Error("Service error");
      (RepositoryServices.getHeatMapData as jest.Mock).mockRejectedValue(mockError);

      await RepositoryController.getHeatMapData(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getMergedPullRequests", () => {
    it("should return merged pull requests", async () => {
      const mockData = [{ id: 1, title: "PR 1" }];
      (RepositoryServices.getMergedPullRequests as jest.Mock).mockResolvedValue(mockData);

      await RepositoryController.getMergedPullRequests(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(RepositoryServices.getMergedPullRequests).toHaveBeenCalledWith({
        owner: "testOwner",
        repository: "testRepo",
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle service error", async () => {
      const mockError = new Error("Service error");
      (RepositoryServices.getMergedPullRequests as jest.Mock).mockRejectedValue(mockError);

      await RepositoryController.getMergedPullRequests(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("download", () => {
    it("should download repository with default branch", async () => {
      const mockDetails = { default_branch: "main" };
      const mockDownload = jest.fn();

      (RepositoryServices.getDetails as jest.Mock).mockResolvedValue(mockDetails);
      (RepositoryServices.download as jest.Mock).mockImplementation(mockDownload);

      await RepositoryController.download(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(RepositoryServices.getDetails).toHaveBeenCalledWith("testOwner", "testRepo");
      expect(RepositoryServices.download).toHaveBeenCalledWith(
        { owner: "testOwner", repository: "testRepo", branch: "main" },
        mockResponse
      );
    });

    it("should download repository with specified branch", async () => {
      mockRequest.params.branch = "develop";
      const mockDownload = jest.fn();

      (RepositoryServices.download as jest.Mock).mockImplementation(mockDownload);

      await RepositoryController.download(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(RepositoryServices.getDetails).not.toHaveBeenCalled();
      expect(RepositoryServices.download).toHaveBeenCalledWith(
        { owner: "testOwner", repository: "testRepo", branch: "develop" },
        mockResponse
      );
    });

    it("should return 400 if missing owner or repository", async () => {
      mockRequest.params = {};

      await RepositoryController.download(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Missing required parameters: 'owner' and/or 'repository' are missing",
      });
    });

    it("should handle service error", async () => {
      const mockError = new Error("Service error");
      (RepositoryServices.getDetails as jest.Mock).mockRejectedValue(mockError);

      await RepositoryController.download(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getSourceTree", () => {
    it("should return structured source tree with default branch", async () => {
      const mockDetails = { default_branch: "main" };
      const mockTree = {
        tree: [
          { path: "file1.txt", type: "blob" },
          { path: "dir1/file2.txt", type: "blob" },
          { path: "dir1", type: "tree" },
        ],
      };

      (RepositoryServices.getDetails as jest.Mock).mockResolvedValue(mockDetails);
      (RepositoryServices.getSourceTree as jest.Mock).mockResolvedValue(mockTree);

      await RepositoryController.getSourceTree(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(RepositoryServices.getSourceTree).toHaveBeenCalledWith({
        owner: "testOwner",
        repository: "testRepo",
        branch: "main",
      });

      const expectedTree = {
        name: "testRepo",
        type: "directory",
        children: [
          {
            name: "file1.txt",
            type: "file",
            children: [],
          },
          {
            name: "dir1",
            type: "directory",
            children: [
              {
                name: "file2.txt",
                type: "file",
                children: [],
              },
            ],
          },
        ],
      };

      expect(mockResponse.json).toHaveBeenCalledWith(expectedTree);
    });

    it("should return 400 if missing owner or repository", async () => {
      mockRequest.params = {};

      await RepositoryController.getSourceTree(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Missing required parameters: 'owner' and/or 'repository' are missing",
      });
    });

    it("should handle service error", async () => {
      const mockError = new Error("Service error");
      (RepositoryServices.getDetails as jest.Mock).mockRejectedValue(mockError);

      await RepositoryController.getSourceTree(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getViews", () => {
    it("should return repository views", async () => {
      const mockData = { count: 100, uniques: 50 };
      (RepositoryServices.getViews as jest.Mock).mockResolvedValue(mockData);

      await RepositoryController.getViews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(RepositoryServices.getViews).toHaveBeenCalledWith("testOwner", "testRepo");
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle service error", async () => {
      const mockError = new Error("Service error");
      (RepositoryServices.getViews as jest.Mock).mockRejectedValue(mockError);

      await RepositoryController.getViews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getRepositoryLanguages", () => {
    it("should return repository languages", async () => {
      const mockData = { JavaScript: 100, TypeScript: 50 };
      (RepositoryServices.getLanguages as jest.Mock).mockResolvedValue(mockData);

      await RepositoryController.getRepositoryLanguages(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(RepositoryServices.getLanguages).toHaveBeenCalledWith("testOwner", "testRepo");
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle service error", async () => {
      const mockError = new Error("Service error");
      (RepositoryServices.getLanguages as jest.Mock).mockRejectedValue(mockError);

      await RepositoryController.getRepositoryLanguages(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getDetails", () => {
    it("should return complete repository details", async () => {
      const mockDetails = {
        name: "testRepo",
        full_name: "testOwner/testRepo",
        default_branch: "main",
        owner: { login: "testOwner", avatar_url: "avatarUrl" },
        stargazers_count: 100,
        license: { name: "MIT" },
        description: "Test repo",
        forks_count: 20,
        watchers_count: 30,
        size: 1024,
        open_issues_count: 5,
        created_at: "2020-01-01T00:00:00Z",
        updated_at: "2021-01-01T00:00:00Z",
      };

      const mockReleases = {
        latest: { tag_name: "v1.0", published_at: "2021-01-01" },
        nbReleases: 3,
      };

      const mockLanguages = { JavaScript: 100 };
      const mockProjectType = { type: "node", dependencyFile: "package.json" };
      const mockReadmeFilename = "README.md";

      (RepositoryServices.getDetails as jest.Mock).mockResolvedValue(mockDetails);
      (RepositoryServices.getReleases as jest.Mock).mockResolvedValue(mockReleases);
      (RepositoryServices.getLanguages as jest.Mock).mockResolvedValue(mockLanguages);
      (RepositoryServices.getProjectType as jest.Mock).mockResolvedValue(mockProjectType);
      (RepositoryServices.getReadmeFileName as jest.Mock).mockResolvedValue(mockReadmeFilename);

      await RepositoryController.getDetails(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        name: "testRepo",
        fullName: "testOwner/testRepo",
        defaultBranch: "main",
        owner: {
          login: "testOwner",
          avatarUrl: "avatarUrl",
          contributions: 0,
        },
        stars: 100,
        license: "MIT",
        description: "Test repo",
        releases: {
          latestRelease: {
            tagName: "v1.0",
            releaseDate: "2021-01-01",
          },
          nbReleases: 3,
        },
        forkCount: 20,
        watchersCount: 30,
        size: "1.00 MB",
        languages: { JavaScript: 100 },
        openIssues: 5,
        createdAt: "2020-01-01",
        updatedAt: "2021-01-01T00:00:00Z",
        readme: "README.md",
        projectType: "node",
        dependencyFile: "package.json",
      });
    });

    it("should handle missing optional fields", async () => {
      const mockDetails = {
        name: "testRepo",
        full_name: "testOwner/testRepo",
        default_branch: "main",
        owner: { login: "testOwner", avatar_url: "avatarUrl" },
        stargazers_count: 100,
        license: null,
        description: null,
        forks_count: 20,
        watchers_count: 30,
        size: 1024,
        open_issues_count: 5,
        created_at: "2020-01-01T00:00:00Z",
        updated_at: "2021-01-01T00:00:00Z",
      };

      const mockReleases = {
        latest: null,
        nbReleases: 0,
      };

      const mockLanguages = {};
      const mockProjectType = { type: "unknown", dependencyFile: "" };
      const mockReadmeFilename = null;

      (RepositoryServices.getDetails as jest.Mock).mockResolvedValue(mockDetails);
      (RepositoryServices.getReleases as jest.Mock).mockResolvedValue(mockReleases);
      (RepositoryServices.getLanguages as jest.Mock).mockResolvedValue(mockLanguages);
      (RepositoryServices.getProjectType as jest.Mock).mockResolvedValue(mockProjectType);
      (RepositoryServices.getReadmeFileName as jest.Mock).mockResolvedValue(mockReadmeFilename);

      await RepositoryController.getDetails(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          license: null,
          description: null,
          releases: {
            latestRelease: null,
            nbReleases: 0,
          },
          readme: null,
        })
      );
    });

    it("should return 400 if missing owner or repository", async () => {
      mockRequest.params = {};

      await RepositoryController.getDetails(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: "Missing required parameters: 'owner' or 'repository'",
      });
    });

    it("should handle service error", async () => {
      const mockError = new Error("Service error");
      (RepositoryServices.getDetails as jest.Mock).mockRejectedValue(mockError);

      await RepositoryController.getDetails(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getClones", () => {
    it("should return clone data", async () => {
      const mockData = { count: 100, uniques: 50 };
      (RepositoryServices.getClonesData as jest.Mock).mockResolvedValue(mockData);

      await RepositoryController.getClones(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(RepositoryServices.getClonesData).toHaveBeenCalledWith("testOwner", "testRepo");
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle service error", async () => {
      const mockError = new Error("Service error");
      (RepositoryServices.getClonesData as jest.Mock).mockRejectedValue(mockError);

      await RepositoryController.getClones(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getCommits", () => {
    it("should return formatted commits with query params", async () => {
      mockRequest.query = {
        since: "2022-01-01",
        until: "2022-12-31",
        commitsPerPage: "10",
        currentPage: "1",
      };

      const mockCommits = [
        {
          sha: "abc123",
          commit: {
            author: {
              name: "Test User",
              date: "2022-06-01T00:00:00Z",
            },
          },
        },
      ];

      (RepositoryServices.getCommits as jest.Mock).mockResolvedValue(mockCommits);

      await RepositoryController.getCommits(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(RepositoryServices.getCommits).toHaveBeenCalledWith({
        owner: "testOwner",
        repository: "testRepo",
        since: "2022-01-01",
        until: "2022-12-31",
        commitsPerPage: 10,
        currentPage: 1,
      });

      expect(mockResponse.json).toHaveBeenCalledWith([
        {
          id: "abc123",
          author: "Test User",
          date: "2022-06-01T00:00:00Z",
        },
      ]);
    });

    it("should return 400 if missing owner or repository", async () => {
      mockRequest.params = {};

      await RepositoryController.getCommits(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: "Missing required parameters: 'owner' or 'repository'",
      });
    });

    it("should handle service error", async () => {
      const mockError = new Error("Service error");
      (RepositoryServices.getCommits as jest.Mock).mockRejectedValue(mockError);

      await RepositoryController.getCommits(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getClones", () => {
    it("should return clone data", async () => {
      const mockData = { count: 100, uniques: 50 };
      (RepositoryServices.getClonesData as jest.Mock).mockResolvedValue(mockData);

      await RepositoryController.getClones(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(RepositoryServices.getClonesData).toHaveBeenCalledWith("testOwner", "testRepo");
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle service error", async () => {
      const mockError = new Error("Service error");
      (RepositoryServices.getClonesData as jest.Mock).mockRejectedValue(mockError);

      await RepositoryController.getClones(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getCommits", () => {
    it("should return formatted commits with query params", async () => {
      mockRequest.query = {
        since: "2022-01-01",
        until: "2022-12-31",
        commitsPerPage: "10",
        currentPage: "1",
      };

      const mockCommits = [
        {
          sha: "abc123",
          commit: {
            author: {
              name: "Test User",
              date: "2022-06-01T00:00:00Z",
            },
          },
        },
      ];

      (RepositoryServices.getCommits as jest.Mock).mockResolvedValue(mockCommits);

      await RepositoryController.getCommits(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(RepositoryServices.getCommits).toHaveBeenCalledWith({
        owner: "testOwner",
        repository: "testRepo",
        since: "2022-01-01",
        until: "2022-12-31",
        commitsPerPage: 10,
        currentPage: 1,
      });

      expect(mockResponse.json).toHaveBeenCalledWith([
        {
          id: "abc123",
          author: "Test User",
          date: "2022-06-01T00:00:00Z",
        },
      ]);
    });

    it("should return 400 if missing owner or repository", async () => {
      mockRequest.params = {};

      await RepositoryController.getCommits(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: "Missing required parameters: 'owner' or 'repository'",
      });
    });

    it("should handle service error", async () => {
      const mockError = new Error("Service error");
      (RepositoryServices.getCommits as jest.Mock).mockRejectedValue(mockError);

      await RepositoryController.getCommits(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getPunchCard", () => {
    it("should return punch card data", async () => {
      const mockData = { days: [{ count: 10 }] };
      (RepositoryServices.getPunchCard as jest.Mock).mockResolvedValue(mockData);

      await RepositoryController.getPunchCard(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(RepositoryServices.getPunchCard).toHaveBeenCalledWith("testOwner", "testRepo");
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle service error", async () => {
      const mockError = new Error("Service error");
      (RepositoryServices.getPunchCard as jest.Mock).mockRejectedValue(mockError);

      await RepositoryController.getPunchCard(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("checkDependenciesFile", () => {
    it("should return true if file exists", async () => {
      (RepositoryServices.getFile as jest.Mock).mockResolvedValue(true);

      await RepositoryController.checkDependenciesFile(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(RepositoryServices.getFile).toHaveBeenCalledWith({
        owner: "testOwner",
        repository: "testRepo",
        path: "package.json",
      });
      expect(mockResponse.json).toHaveBeenCalledWith(true);
    });

    it("should return false if file does not exist", async () => {
      (RepositoryServices.getFile as jest.Mock).mockResolvedValue(false);

      await RepositoryController.checkDependenciesFile(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith(false);
    });

    it("should handle service error", async () => {
      const mockError = new Error("Service error");
      (RepositoryServices.getFile as jest.Mock).mockRejectedValue(mockError);

      await RepositoryController.checkDependenciesFile(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getFileContent", () => {
    it("should return file content", async () => {
      mockRequest.params[0] = "path/to/file.txt";
      const mockContent = "File content";

      (RepositoryServices.getFile as jest.Mock).mockResolvedValue(mockContent);

      await RepositoryController.getFileContent(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(RepositoryServices.getFile).toHaveBeenCalledWith({
        owner: "testOwner",
        repository: "testRepo",
        path: "path/to/file.txt",
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockContent);
    });

    it("should handle service error", async () => {
      mockRequest.params[0] = "path/to/file.txt";
      const mockError = new Error("Service error");

      (RepositoryServices.getFile as jest.Mock).mockRejectedValue(mockError);

      await RepositoryController.getFileContent(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
