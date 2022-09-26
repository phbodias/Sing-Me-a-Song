import { Router } from "express";
import { populateDB, resetDB } from "../controllers/testsController.js";

const testsRouter = Router();

testsRouter.post("/resetdb", resetDB);
testsRouter.post("/populateDB", populateDB);

export default testsRouter;
