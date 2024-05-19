export interface HttpRequestOptions {
  method?: string;
  url: string;
  referer?: string;
  body?: any;
}

export interface GraphQLRequestOptions {
  origin?: string;
  referer?: string;
  query: string;
  variables?: object;
}

export interface Credit {
  session?: string;
  csrfToken: string;
}

export enum ProblemStatus {
  "Accept",
  "Not Accept",
  "Not Start",
}

export enum ProblemDifficulty {
  "Easy",
  "Medium",
  "Hard",
}

export enum SubmissionStatus {
  "Accepted",
  "Compile Error",
  "Wrong Answer",
  "Time Limit Exceeded",
  "Memory Limit Exceeded",
  "Output Limit Exceeded",
  "Runtime Error",
  "Internal Error",
  "Timeout",
}

export enum EndPoint {
  "US",
  "CN",
}

export interface Uris {
  base: string;
  login: string;
  graphql: string;
  problemsAll: string;
  problem: string;
  submit: string;
}

export type SubmissionConstructor = {
  id: number;
  title: string;
  titleSlug: string;
  status: SubmissionStatus;
  statusDisplay: string;
  lang: string;
  langName: string;
  runtime: number;
  timestamp: number;
  url: string;
  isPending: boolean;
  memory: number;
  hasNotes: boolean;
  notes: string;
  flagType: string;
  topicTags: Array<string>;
  code?: string;
};
