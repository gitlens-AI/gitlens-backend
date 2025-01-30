import { NextFunction, Request, Response } from "express";
import { ApiError } from "../error/ApiError";
import RepoController from "../DBControllers/RepoController";

class RepositoryController {
    getLastRepos = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lastRepos = await RepoController.getLastRepos();
            return res.json(lastRepos);
        } catch (e: any) {
            console.error("RepositoryController getLastRepos error:", e.message);
            next(ApiError.badRequest(e.message));
        }
    };
}

export default new RepositoryController();
