import Repo from "../models/Repo.model";

class RepoController {
    addRepoOrUpdate = async (author: string, name: string, score: number | null) => {
        try {
            let repo = await this.getRepo(author, name);
            if (repo) {
                repo.checkedTimes += 1;
                if (score !== null) {
                    repo.score = score;
                }
                await repo.save();
            } else {
                repo = await Repo.create({ author, name, score, checkedTimes: 1 } as Repo);
            }
            return repo;
        } catch (e: any) {
            console.error("RepoController addRepo error:", e.message);
            return null;
        }
    };

    getRepo = async (author: string, name: string) => {
        try {
            const repo = await Repo.findOne({ where: { author, name } });
            return repo;
        } catch (e: any) {
            console.error("RepoController getRepo error:", e.message);
            return null;
        }
    };

    getLastRepos = async () => {
        try {
            const repos = await Repo.findAll({ order: [["updatedAt", "DESC"]], limit: 20 });
            return repos;
        } catch (e: any) {
            console.error("RepoController getLastRepos error:", e.message);
            return [];
        }
    };
}

export default new RepoController();
