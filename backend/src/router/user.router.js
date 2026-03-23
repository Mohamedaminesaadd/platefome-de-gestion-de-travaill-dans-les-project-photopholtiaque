
import { Router } from "express";
import { registerUser, loginUser ,resetPassword, forgotPassword} from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

// Routes publiques
router.post("/register", registerUser);
router.post("/login", loginUser);


router.post('/forget-password', forgotPassword );
router.post('/reset-password', resetPassword );


// Route protégée
router.get("/profile", verifyToken, (req, res) => {
  // req.user contient id + email depuis le token
  res.json({
    message: "This is a protected route",
    user: req.user,
  });
});

/* 
// Route accessible uniquement à l'ADMIN
router.get("/admin/dashboard", verifyToken, verifyRole("ADMIN"), getAdminDashboard);

// Route accessible aux ADMIN et DIRECTOR
router.get("/director/dashboard", verifyToken, verifyRoles("ADMIN", "DIRECTOR"), getDirectorDashboard);*/


export default router;