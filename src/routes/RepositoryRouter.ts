import express from "express";
import RepositoryController from "../controllers/RepositoryController";

const router = express.Router();

router.get("/last", RepositoryController.getLastRepos);

export default router;
