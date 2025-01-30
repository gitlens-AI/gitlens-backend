import { NextFunction, Response, Request } from "express";
import { AuthenticatedRequest } from "../helpers/Interfaces";
import { ApiError } from "../error/ApiError";
import OpenAiService from "../services/OpenAiService";
import GithubService from "../services/GithubService";
import { parseScoreFromResponse, timeout } from "../helpers/Helpers";
import fs from "fs";
import RepoController from "../DBControllers/RepoController";

class AskController {
    validateCode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { code } = req.body;
            if (!code) {
                return next(ApiError.badRequest("no code was provided"));
            }

            const result = await OpenAiService.validateCode(code);
            return res.json({ result });
        } catch (e: any) {
            console.error("AskController validateCode error:", e.message);
            next(ApiError.badRequest(e.message));
        }
    };

    generateCode = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { request, isNew } = req.body;
            const adddress = req.userPayload?.address;
            if (!request) {
                return next(ApiError.badRequest("no request was provided"));
            }
            if (!adddress) {
                return next(ApiError.badRequest("no address was provided"));
            }

            const result = await OpenAiService.generateCode(request, adddress, isNew);
            return res.json({ result });
        } catch (e: any) {
            console.error("AskController generateCode error:", e.message);
            next(ApiError.badRequest(e.message));
        }
    };

    validateRepository = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { url } = req.body;
            if (!url) {
                return next(ApiError.badRequest("no url was provided"));
            }
            const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
            if (!match) {
                return next(ApiError.badRequest("wrong repository link"));
            }

            const [_, author, name] = match;
            let result;
            const repositoryInfo = await GithubService.getRepoInfo(url);
            if (repositoryInfo) {
                result = await OpenAiService.validateRepository(repositoryInfo);
                const totalPoints = parseScoreFromResponse(result);
                const repo = await RepoController.addRepoOrUpdate(author, name, totalPoints);
                if (repo && result !== "Some error" && result !== "Error: empty answer") {
                    result += `\n#### Total Checked: ${repo.checkedTimes} times.`;
                }
            } else {
                result = "Error with repository validation. Check if it's not private.";
            }
            return res.json({ result });
        } catch (e: any) {
            console.error("AskController validateCode error:", e.message);
            next(ApiError.badRequest(e.message));
        }
    };
}

export default new AskController();
