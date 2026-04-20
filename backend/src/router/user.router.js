import { Router } from "express";
import {
  registerUser,
  loginUser,
  resetPassword,
  forgotPassword,
  getUsersByRole,
  getAllTechnicians,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

// ================= PUBLIC ROUTES =================
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ================= PROTECTED ROUTES =================
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "This is a protected route",
    user: req.user,
  });
});

router.get("/technicians", getAllTechnicians);
router.get("/role/:role", getUsersByRole);

export default router;