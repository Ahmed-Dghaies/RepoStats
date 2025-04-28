import { extractRepositoryDetailsFromUrl } from "@/utils/general/url";
import { packageDetails } from "./types";

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

export const fetchPackagesSummary = async ({
  dependencies,
  lockFileContent,
}: {
  dependencies: Record<string, string>;
  lockFileContent: string;
}): Promise<packageDetails[]> => {
  let lockDependencies: any = {};
  try {
    lockDependencies = JSON.parse(lockFileContent)?.dependencies ?? {};
  } catch {
    console.warn("Unable to parse lock file – falling back to package.json versions");
  }

  const formattedDependencies = await Promise.all(
    Object.entries(dependencies).map(async ([packageName, packageVersion]) => {
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
      const {
        platform = "",
        organization = "",
        repository = "",
      } = repoDetails === null ? {} : repoDetails;
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
  );
  return formattedDependencies;
};
