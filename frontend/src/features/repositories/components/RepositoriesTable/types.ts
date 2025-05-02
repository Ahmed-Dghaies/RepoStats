export interface NewRepositoryDetails {
  isValid: boolean;
  platform: string;
  organization: string;
  repository: string;
  projectType: string;
  defaultBranch: string;
  dependencyFile: string | null;
  readme: string | null;
}
