import express from 'express';
import { verifyToken } from "../middlewares/auth.js";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';

const router = express.Router();

router.post('/', createProject);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;