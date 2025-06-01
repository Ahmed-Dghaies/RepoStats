import { extractRepositoryDetailsFromUrl } from "@/utils/general/url";
import { PackageDetails } from "./types";
import pLimit from "p-limit";
import { fetchFileContent } from "../../services/repositories";
import { ProjectType, RepositoryInfo } from "@/types/repository";
import axios from "axios";
import { parse } from "toml";

interface NpmsPackageDetails {
  collected: {
    metadata: {
      author: { username: string };
      links: { repository: string };
      version: string;
      date: string;
      description: string;
    };
  };
}

const fetchDependencyScore = async ({
  packageName,
  organization,
  platform,
}: {
  packageName: string;
  organization: string;
  platform: string;
}): Promise<number | null> => {
  try {
    if (!platform || !organization || !packageName) return null;
    const response = await fetch(
      `https://api.securityscorecards.dev/projects/${platform}/${organization}/${packageName}`
    );
    if (!response.ok) throw new Error("Failed to fetch dependency score");
    const data = await response.json();
    return data.score;
  } catch (err) {
    console.error(`Error fetching package score for ${packageName}: `, err);
    return null;
  }
};

const fetchNpmPackageDetails = async ({
  packageName,
}: {
  packageName: string;
}): Promise<NpmsPackageDetails | null> => {
  try {
    const response = await fetch(`https://api.npms.io/v2/package/${packageName}`);
    if (!response.ok) throw new Error("Failed to fetch npm package details");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching package details for ${packageName}: `, error);
    return null;
  }
};

const findPackageVersion = (dependencies: any, packageName: string): string | null => {
  if (!dependencies) return null;
  if (dependencies[packageName]) {
    return dependencies[packageName].version;
  }
  for (const dep in dependencies) {
    if (dependencies[dep].dependencies) {
      const version: string | null = findPackageVersion(
        dependencies[dep].dependencies,
        packageName
      );
      if (version) {
        return version;
      }
    }
  }
  return null;
};

const fetchNodeProjectDependencies = async ({
  repositoryDetails,
}: {
  repositoryDetails: RepositoryInfo;
}): Promise<PackageDetails[]> => {
  const packageFile = await fetchFileContent({ repositoryDetails, path: "package.json" });
  const packageLockFile = await fetchFileContent({
    repositoryDetails,
    path: "package-lock.json",
  });

  if (!repositoryDetails || !packageFile) return [];

  let dependencies: Record<string, string> = {};
  try {
    dependencies = JSON.parse(packageFile).dependencies;
  } catch (error) {
    console.error("Error parsing package.json:", error);
  }
  const lockFileContent = packageLockFile ?? "{}";

  let lockDependencies: any = {};
  try {
    lockDependencies = JSON.parse(lockFileContent)?.dependencies ?? {};
  } catch {
    console.warn("Unable to parse lock file – falling back to package.json versions");
  }

  // This limits the number of concurrent requests to avoid rate limiting and browser errors for huge repositories
  const limit = pLimit(10);
  const formattedDependencies = await Promise.all(
    Object.entries(dependencies).map(([packageName, packageVersion]) =>
      limit(async () => {
        const encodedPackageName = encodeURIComponent(packageName);
        const packageDetails = await fetchNpmPackageDetails({ packageName: encodedPackageName });
        const packageMetaData = packageDetails?.collected.metadata;
        if (!packageDetails || !packageMetaData) {
          return {
            name: packageName,
            author: null,
            organization: null,
            usedVersion: packageVersion,
            latestVersion: null,
            lastUpdate: null,
            description: null,
            dependencyScore: null,
          };
        }
        const usedVersion = findPackageVersion(lockDependencies, packageName) ?? packageVersion;
        const repoDetails = packageMetaData.links?.repository
          ? extractRepositoryDetailsFromUrl(packageMetaData.links.repository)
          : null;
        const { platform = "", organization = "", repository = "" } = repoDetails ?? {};
        const dependencyScore = await fetchDependencyScore({
          packageName: repository ?? packageName,
          organization: organization ?? packageMetaData.author?.username ?? "",
          platform,
        });
        return {
          name: packageName,
          author: packageMetaData.author?.username ?? "",
          organization: organization ?? "",
          usedVersion,
          latestVersion: packageMetaData.version,
          lastUpdate: packageMetaData.date,
          description: packageMetaData.description,
          dependencyScore,
        };
      })
    )
  );

  return formattedDependencies;
};

const fetchPythonProjectDependencies = async ({
  repositoryDetails,
}: {
  repositoryDetails: RepositoryInfo;
}): Promise<PackageDetails[]> => {
  try {
    // 1. Fetch dependency files
    const requirementsFile = await fetchFileContent({
      repositoryDetails,
      path: "requirements.txt",
    });
    const pyProjectFile = await fetchFileContent({ repositoryDetails, path: "pyproject.toml" });

    const packages: PackageDetails[] = [];

    // 2. Parse requirements.txt if exists
    if (requirementsFile) {
      const requirements = requirementsFile
        .split("\n")
        .filter((line) => line.trim() && !line.trim().startsWith("#"))
        .map((line) => {
          // Extract package name and version (handling cases like "package==1.0.0")
          const match = line.trim().match(/^([a-zA-Z0-9_-]+)([=<>~!]=?.*)?$/);
          return match
            ? { name: match[1], version: match[2]?.replace(/^[=<>~!]=?/, "") || null }
            : null;
        })
        .filter(Boolean);

      for (const req of requirements) {
        if (req) {
          const { name, version } = req;
          const pkgInfo = await getPyPIMetadata(name);
          if (!pkgInfo) continue; // Skip if package metadata not found

          packages.push({
            name,
            usedVersion: version,
            latestVersion: pkgInfo?.version || null,
            author: pkgInfo?.author || null,
            organization: pkgInfo?.organization || null,
            lastUpdate: pkgInfo?.last_update || null,
            description: pkgInfo?.description || null,
            dependencyScore: calculateDependencyScore(version, pkgInfo?.version),
          });
        }
      }
    }

    // 3. Parse pyproject.toml if exists
    if (pyProjectFile) {
      try {
        const pyProject = parse(pyProjectFile);
        const deps = [
          ...(pyProject.tool?.poetry?.dependencies || []),
          ...(pyProject.project?.dependencies || []),
        ];

        for (const [name, versionObj] of Object.entries(deps)) {
          if (typeof name !== "string") continue;

          const version = typeof versionObj === "string" ? versionObj : versionObj?.version;
          if (!packages.some((p) => p.name === name)) {
            const pkgInfo = await getPyPIMetadata(name);
            packages.push({
              name,
              usedVersion: version,
              latestVersion: pkgInfo?.version || null,
              author: pkgInfo?.author || null,
              organization: pkgInfo?.organization || null,
              lastUpdate: pkgInfo?.last_update || null,
              description: pkgInfo?.description || null,
              dependencyScore: calculateDependencyScore(version, pkgInfo?.version),
            });
          }
        }
      } catch (tomlError) {
        console.error("Error parsing pyproject.toml:", tomlError);
      }
    }

    return packages;
  } catch (error) {
    console.error("Error fetching dependencies:", error);
    return [];
  }
};

async function getPyPIMetadata(packageName: string): Promise<{
  version?: string;
  author?: string;
  organization?: string;
  last_update?: string;
  description?: string;
} | null> {
  try {
    const response = await axios.get(`https://pypi.org/pypi/${packageName}/json`);
    const info = response.data?.info;
    return {
      version: info?.version,
      author: info?.author,
      organization: info?.author_email?.split("@")[1]?.split(".")[0], // Extract domain from email
      last_update: info?.release_date,
      description: info?.summary,
    };
  } catch (error) {
    console.error(`Failed to fetch metadata for ${packageName}:`, error);
    return null;
  }
}

function calculateDependencyScore(
  usedVersion: string | null,
  latestVersion: string | undefined
): number | null {
  if (!usedVersion || !latestVersion) return null;

  try {
    const usedParts = usedVersion.split(".").map(Number);
    const latestParts = latestVersion.split(".").map(Number);

    let score = 100;
    for (let i = 0; i < Math.min(usedParts.length, latestParts.length); i++) {
      if (usedParts[i] < latestParts[i]) {
        score -= 25 * (i + 1);
      }
    }

    return Math.max(0, score);
  } catch {
    return null;
  }
}

const fetchPhpProjectDependencies = async ({
  repositoryDetails,
}: {
  repositoryDetails: RepositoryInfo;
}): Promise<PackageDetails[]> => {
  try {
    const composerContent = await fetchFileContent({
      repositoryDetails,
      path: "composer.json",
    });

    if (!composerContent) return [];

    const composerJson = JSON.parse(composerContent) as {
      require?: Record<string, string>;
      "require-dev"?: Record<string, string>;
    };
    const packages: PackageDetails[] = [];

    const allDependencies = {
      ...(composerJson.require || {}),
      ...(composerJson["require-dev"] || {}),
    };

    for (const [name, version] of Object.entries(allDependencies)) {
      try {
        const packagistResponse = await axios.get(`https://repo.packagist.org/p2/${name}.json`);
        const packageData = packagistResponse.data.packages[name][0];

        packages.push({
          name,
          usedVersion: version.toString().replace(/^[\^~]/, ""),
          latestVersion: packageData.version,
          author: packageData.authors?.[0]?.name || null,
          organization: name.split("/")[0] || null,
          lastUpdate: packageData.time || null,
          description: packageData.description || null,
          dependencyScore: calculateDependencyScore(version.toString(), packageData.version),
        });
      } catch (error) {
        console.error(`Failed to fetch Packagist data for ${name}:`, error);
        packages.push({
          name,
          usedVersion: version.toString().replace(/^[\^~]/, ""),
          latestVersion: null,
          author: null,
          organization: null,
          lastUpdate: null,
          description: null,
          dependencyScore: null,
        });
      }
    }

    return packages;
  } catch (error) {
    console.error("Error processing PHP project dependencies:", error);
    return [];
  }
};

const fetchRustProjectDependencies = async ({
  repositoryDetails,
}: {
  repositoryDetails: RepositoryInfo;
}): Promise<PackageDetails[]> => {
  try {
    const cargoContent = await fetchFileContent({
      repositoryDetails,
      path: "Cargo.toml",
    });

    if (!cargoContent) return [];

    const cargoToml = parse(cargoContent) as {
      dependencies?: Record<string, string | { version: string }>;
    };
    const packages: PackageDetails[] = [];

    for (const [name, spec] of Object.entries(cargoToml.dependencies || {})) {
      try {
        const version = typeof spec === "string" ? spec : spec.version;
        const cratesResponse = await axios.get(`https://crates.io/api/v1/crates/${name}`);
        const crateData = cratesResponse.data.crate;

        packages.push({
          name,
          usedVersion: version?.replace(/^[\^~=]/, "") || null,
          latestVersion: crateData.newest_version,
          author: crateData.authors?.[0] || null,
          organization: null, // Rust crates don't typically have organizations
          lastUpdate: crateData.updated_at || null,
          description: crateData.description || null,
          dependencyScore: calculateDependencyScore(version, crateData.newest_version),
        });
      } catch (error) {
        console.error(`Failed to fetch crates.io data for ${name}:`, error);
        packages.push({
          name,
          usedVersion:
            typeof spec === "string" ? spec.replace(/^[\^~=]/, "") : spec?.version || null,
          latestVersion: null,
          author: null,
          organization: null,
          lastUpdate: null,
          description: null,
          dependencyScore: null,
        });
      }
    }

    return packages;
  } catch (error) {
    console.error("Error processing Rust project dependencies:", error);
    return [];
  }
};

const fetchGoProjectDependencies = async ({
  repositoryDetails,
}: {
  repositoryDetails: RepositoryInfo;
}): Promise<PackageDetails[]> => {
  try {
    const goModContent = await fetchFileContent({
      repositoryDetails,
      path: "go.mod",
    });

    if (!goModContent) return [];

    const packages: PackageDetails[] = [];
    const moduleLines = goModContent
      .split("\n")
      .filter((line) => line.startsWith("\t") && !line.includes("indirect"));

    for (const line of moduleLines) {
      const [name, version] = line.trim().split(/\s+/);
      try {
        const proxyResponse = await axios.get(`https://proxy.golang.org/${name}/@v/list`);
        const versions = proxyResponse.data.split("\n").filter(Boolean);
        const latestVersion = versions[versions.length - 1];

        packages.push({
          name,
          usedVersion: version?.replace(/^v/, "") || null,
          latestVersion: latestVersion?.replace(/^v/, "") || null,
          author: null, // Go modules don't provide author info in the proxy
          organization: name.split("/")[0] || null,
          lastUpdate: null, // Would need to fetch from GitHub API
          description: null, // Would need to fetch from GitHub API
          dependencyScore: calculateDependencyScore(version, latestVersion),
        });
      } catch (error) {
        console.error(`Failed to fetch Go module data for ${name}:`, error);
        packages.push({
          name,
          usedVersion: version?.replace(/^v/, "") || null,
          latestVersion: null,
          author: null,
          organization: null,
          lastUpdate: null,
          description: null,
          dependencyScore: null,
        });
      }
    }

    return packages;
  } catch (error) {
    console.error("Error processing Go project dependencies:", error);
    return [];
  }
};

export const fetchPackagesSummary = async ({
  projectType,
  repositoryDetails,
}: {
  projectType: ProjectType;
  repositoryDetails: RepositoryInfo;
}): Promise<PackageDetails[]> => {
  switch (projectType) {
    case "node":
      return await fetchNodeProjectDependencies({ repositoryDetails });
    case "python":
      return await fetchPythonProjectDependencies({ repositoryDetails });
    case "php":
      return await fetchPhpProjectDependencies({ repositoryDetails });
    case "rust":
      return await fetchRustProjectDependencies({ repositoryDetails });
    case "go":
      return await fetchGoProjectDependencies({ repositoryDetails });
    case "c++":
    case "unknown":
      return [];
    default: {
      const _exhaustiveCheck: never = projectType;
      return _exhaustiveCheck;
    }
  }
};
