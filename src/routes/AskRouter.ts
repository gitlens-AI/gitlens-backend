import express from "express";
import AskController from "../controllers/AskController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/validate", AskController.validateCode);
router.post("/generate", authMiddleware, AskController.generateCode);
router.post("/repo", AskController.validateRepository);

export default router;
