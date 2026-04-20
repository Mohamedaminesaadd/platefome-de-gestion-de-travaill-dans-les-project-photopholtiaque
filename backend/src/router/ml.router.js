import express from "express";
import { mlpredict } from "../controllers/ml.controller.js";

const router = express.Router();

router.post("/predict", mlpredict);

export default router;