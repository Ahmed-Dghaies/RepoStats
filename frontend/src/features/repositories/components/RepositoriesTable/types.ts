import { ProjectType } from "@/types/repository";

export interface NewRepositoryDetails {
  isValid: boolean;
  platform: string;
  organization: string;
  repository: string;
  projectType: ProjectType;
  defaultBranch: string;
  dependencyFile: string | null;
  readme: string | null;
}
