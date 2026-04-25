import express from "express";
import {
  createTache,
  getAllTaches,
  getTacheById,
  updateTache,
  deleteTache,
  getTachesByPhase,
  getTachesByUser,
  getTachesByProject,
  assignTaches,
  deleteManyTaches
} from "../controllers/tacheController.js";

import { verifyToken } from "../middlewares/auth.js";
import { verifyRole, ROLES } from "../middlewares/roles.js";

const router = express.Router();

/* ================= FILTERS (AVANT /:id) ================= */
router.get("/phase/:phaseId",     getTachesByPhase);
router.get("/user/:userId",       getTachesByUser);
router.get("/project/:projectId", getTachesByProject);

/* ================= ACTIONS BULK ================= */
router.post("/assign",       assignTaches);      // POST /api/taches/assign
router.delete("/bulk-delete", deleteManyTaches); // DELETE /api/taches/bulk-delete

/* ================= CRUD ================= */
router.post("/",    createTache);
router.get("/",     getAllTaches);
router.get("/:id",  getTacheById);
router.patch("/:id", updateTache);
router.delete("/:id", deleteTache);

export default router;