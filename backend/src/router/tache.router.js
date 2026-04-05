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

import { verifyToken } from "../middlewares/auth.js";
import { verifyRole } from "../middlewares/roles.js";
import { ROLES } from "../middlewares/roles.js";

const router = express.Router();

/* ================= FILTERS (AVANT /:id) ================= */
router.get("/phase/:phaseId", verifyToken, verifyRole(ROLES.ADMIN), getTachesByPhase);
router.get("/user/:userId", verifyToken, verifyRole(ROLES.ADMIN), getTachesByUser);
router.get("/project/:projectId", verifyToken, verifyRole(ROLES.ADMIN), getTachesByProject);

/* ================= CRUD ================= */
router.post("/", verifyToken, verifyRole(ROLES.ADMIN), createTache);
router.get("/", verifyToken, verifyRole(ROLES.ADMIN), getAllTaches);
router.get("/:id", verifyToken, verifyRole(ROLES.ADMIN), getTacheById);
router.patch("/:id", verifyToken, verifyRole(ROLES.ADMIN), updateTache);
router.delete("/:id", verifyToken, verifyRole(ROLES.ADMIN), deleteTache);

export default router;