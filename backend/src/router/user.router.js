import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

// Routes publiques
router.post("/register", registerUser);
router.post("/login", loginUser);

// Route protégée
router.get("/profile", verifyToken, (req, res) => {
  // req.user contient id + email depuis le token
  res.json({
    message: "This is a protected route",
    user: req.user,
  });
});

export default router;