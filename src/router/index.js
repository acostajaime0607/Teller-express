import express from "express";
import loanRecordRouter from "../controller/loanRecordController.js";

const appRouter = express.Router();

appRouter.use("/loan", loanRecordRouter);

export default appRouter;
