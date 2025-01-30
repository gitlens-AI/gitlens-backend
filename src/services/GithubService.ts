import { Octokit } from "@octokit/rest";
import { GithubCommitType, GithubContentType, RepositoryInfoType } from "../helpers/Types";

if (!process.env.GITHUB_ACCESS_TOKEN) {
    console.error("GITHUB_ACCESS_TOKEN not set");
    process.exit(1);
}

class GithubService {
    private octokit: Octokit;

    constructor() {
        this.octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });
    }

    private getRepoCommints = async (owner: string, repo: string) => {
        const { data: commits } = await this.octokit.repos.listCommits({
            owner,
            repo,
            per_page: 100,
        });
        const parsedCommits = commits.map((c) => {
            return {
                message: c.commit.message,
                author: c.commit.author?.name,
                date: c.commit.author?.date,
            } as GithubCommitType;
        });
        return parsedCommits;
    };

    private getRepoContents = async (owner: string, repo: string) => {
        const { data: contents } = await this.octokit.repos.getContent({
            owner,
            repo,
            path: "",
        });

        if (Array.isArray(contents)) {
            const contentsArray: GithubContentType[] = contents.map((content) => ({
                name: content.name,
                type: content.type,
                path: content.path,
                url: content.html_url,
            }));

            const folders = contentsArray.filter((c) => c.type === "dir");
            if (folders.length > 0 && folders.length < 3) {
                for (const f of folders) {
                    const { data: folderContents } = await this.octokit.repos.getContent({
                        owner,
                        repo,
                        path: f.path,
                    });
                    if (Array.isArray(folderContents)) {
                        contentsArray.push(...folderContents);
                    }
                }
            }
            return contentsArray;
        }
        return [];
    };

    private getRepoIssues = async (owner: string, repo: string) => {
        const { data: issues } = await this.octokit.issues.listForRepo({
            owner,
            repo,
            state: "open",
        });
        return issues.map((issue) => ({
            title: issue.title,
            url: issue.html_url,
        }));
    };

    // Main info function
    getRepoInfo = async (repoUrl: string): Promise<RepositoryInfoType | null> => {
        try {
            const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
            if (!match) {
                throw new Error("Wrong repository link");
            }

            const [_, owner, repo] = match;
            const { data: repoData } = await this.octokit.repos.get({
                owner,
                repo,
            });

            // Get commits
            const commits = await this.getRepoCommints(owner, repo);

            // Get languages
            const { data: languages } = await this.octokit.repos.listLanguages({
                owner,
                repo,
            });

            // Get issues
            const issues = await this.getRepoIssues(owner, repo);

            // Get all content
            const contents = await this.getRepoContents(owner, repo);

            // Create repo info
            const repoInfo = {
                name: repoData.name,
                description: repoData.description,
                createdAt: repoData.created_at,
                stars: repoData.stargazers_count,
                forks: repoData.forks_count,
                languages: Object.keys(languages),
                openIssuesCount: repoData.open_issues_count,
                commits: commits,
                issues: issues,
                contents: contents,
            };
            return repoInfo;
        } catch (error) {
            console.error("GithubService getRepoInfo error:", error);
            return null;
        }
    };
}

export default new GithubService();
