

import express from "express";
import {
  createTache,
  getAllTaches,
  getTacheById,
  updateTache,
  deleteTache,
  getTachesByPhase,
  getTachesByUser,
  getTachesByProject
} from "../controllers/tacheController.js";

const router = express.Router();

/* ================= CRUD ================= */
router.post("/", createTache);
router.get("/", getAllTaches);
router.get("/:id", getTacheById);
router.patch("/:id", updateTache);
router.delete("/:id", deleteTache);

/* ================= FILTERS ================= */
router.get("/phase/:phaseId", getTachesByPhase);
router.get("/user/:userId", getTachesByUser);
router.get("/project/:projectId", getTachesByProject);

export default router;