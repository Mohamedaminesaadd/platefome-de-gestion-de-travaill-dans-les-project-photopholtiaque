import express from 'express';
import { verifyToken } from "../middlewares/auth.js";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats
} from '../controllers/projectController.js';

const router = express.Router();
// 🔥 1. Routes spécifiques (statics)
router.get('/stats', getProjectStats);


// 🔥 2. Routes générales
router.post('/', createProject);
router.get('/', getAllProjects);

// 🔥 3. Routes avec ID (dynamiques)
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);


export default router;