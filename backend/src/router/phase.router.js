import express from 'express';
import {
  createPhase,
  getPhasesByProject,
  getAllPhases,
  getPhaseById,
  updatePhase,
  deletePhase
} from '../controllers/PhaseController.js';

const router = express.Router();

// CREATE
router.post("/:projectId", createPhase);

// READ ALL BY PROJECT
router.get("/project/:projectId", getPhasesByProject);

router.get('/', getAllPhases);

// READ ONE
router.get('/:id', getPhaseById);

// UPDATE
router.put('/:id', updatePhase);

// DELETE
router.delete('/:id', deletePhase);

export default router;