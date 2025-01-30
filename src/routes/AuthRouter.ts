import express from "express";
import AuthController from "../controllers/AuthController";

const router = express.Router();

router.post("/", AuthController.auth);
router.post("/regenerate", AuthController.regenerate);

export default router;
