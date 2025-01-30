import { ChatCompletionMessageParam } from "openai/resources";

export type OpenAIContextType = {
    [key: string]: {
        messages: ChatCompletionMessageParam[];
    };
};

export type GithubCommitType = {
    message: string;
    author?: string;
    date?: string;
}

export type GithubIssueType = {
    title: string;
    url: string;
};

export type GithubContentType = {
    name: string;
    type: string;
    path: string;
    url: string | null;
};

export type RepositoryInfoType = {
    name: string;
    description: string | null;
    createdAt: string;
    stars: number;
    forks: number;
    languages: string[];
    openIssuesCount: number;
    commits: GithubCommitType[];
    issues: GithubIssueType[];
    contents: GithubContentType[];
};
