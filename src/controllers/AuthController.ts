import { NextFunction, Request, Response } from "express";
import { ApiError } from "../error/ApiError";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import JWTService from "../services/JWTService";
import UserController from "../DBControllers/UserController";

class AuthController {
    auth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { publicKey, message, signature } = req.body;

            if (!publicKey || !message || !signature) {
                return res.status(400).json({ success: false, error: "Missing parameters" });
            }

            const pubKey = new PublicKey(publicKey);
            const signatureUint8 = new Uint8Array(signature);
            const messageBytes = new TextEncoder().encode(message);
            const isVerified = nacl.sign.detached.verify(messageBytes, signatureUint8, pubKey.toBytes());

            if (isVerified) {
                const userAddress = pubKey.toString();
                const dbUser = await UserController.getUser(userAddress);
                if (!dbUser) {
                    await UserController.addUser(userAddress);
                }
                const accessToken = JWTService.generateToken({ address: userAddress });
                return res.json({ accessToken });
            }
            return next(ApiError.forbidden("Signature verification failed"));
        } catch (e: any) {
            console.error("AuthController auth error:", e.message);
            next(ApiError.forbidden(e.message));
        }
    };

    regenerate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.headers?.authorization?.split(" ")[1];
            if (!accessToken) {
                return next(ApiError.forbidden("no auth token"));
            }

            const userData = JWTService.verifyToken(accessToken);
            if (userData === "jwt expired" || typeof userData !== "string") {
                const decodedToken = JWTService.getTokenPayload(accessToken);
                if (decodedToken && decodedToken.address && decodedToken.exp) {
                    const user = await UserController.getUser(decodedToken.address);
                    if (user) {
                        const newAccessToken = JWTService.generateToken({
                            address: decodedToken.address,
                        });
                        return res.json({ accessToken: newAccessToken });
                    }
                    return next(ApiError.badRequest("user not found"));
                }
            }
            next(ApiError.forbidden("wrong token"));
        } catch (e: any) {
            console.error(e.message);
            next(ApiError.badRequest(e.message));
        }
    };
}

export default new AuthController();
