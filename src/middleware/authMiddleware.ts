import { NextFunction, Response } from "express";
import { ApiError } from "../error/ApiError";
import JWTService from "../services/JWTService";
import { AuthenticatedRequest } from "../helpers/Interfaces";
import UserController from "../DBControllers/UserController";

if (!process.env.WHITELIST_ENABLED) {
    console.error("WHITELIST_ENABLED not set");
    process.exit(1);
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiError.forbidden("no auth token"));
        }

        const accessToken = authHeader.split(" ")[1];
        if (!accessToken) {
            return next(ApiError.forbidden("no auth token"));
        }

        const userData = JWTService.verifyToken(accessToken);
        if (typeof userData === "string") {
            return next(ApiError.forbidden("wrong access token"));
        }

        if (process.env.WHITELIST_ENABLED === "true") {
            const dbUser = await UserController.getUser(userData.address);
            if (!dbUser || dbUser.hasWhitelist === false) {
                return next(ApiError.badRequest("no whitelist"));
            }
        }

        req.userPayload = userData;
        next();
    } catch (e: any) {
        return next(ApiError.forbidden("authorization error"));
    }
};
