import express from "express";
import AuthRouter from "./AuthRouter";
import AskRouter from "./AskRouter";
import RepositoryRouter from "./RepositoryRouter";

const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/ask", AskRouter);
router.use("/repo", RepositoryRouter);

export default router;
