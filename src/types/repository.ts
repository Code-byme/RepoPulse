export type Repository = {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  githubUrl: string;
  defaultBranch: string | null;
  lastAnalyzedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type NewRepository = {
  owner: string;
  name: string;
  fullName: string;
  githubUrl: string;
  defaultBranch?: string | null;
};
