import { Request, Response } from "express";
import * as testService from "../services/testsService.js";

export async function resetDB(req: Request, res: Response) {
  await testService.resetDatabase();
  res.sendStatus(200);
}

export async function populateDB(req: Request, res: Response){
  await testService.populateDB();
  res.sendStatus(201);
}