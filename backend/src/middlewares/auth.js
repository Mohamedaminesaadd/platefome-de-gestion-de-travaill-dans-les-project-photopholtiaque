// src/middlewares/auth.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }catch (error) {
    // Distinguer les types d'erreurs pour les logs internes
    if (error.name === "TokenExpiredError") {
      console.warn("⚠️  Expired token attempt");
      return res.status(401).json({ message: "Token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      console.warn("⚠️  Invalid token attempt");
      return res.status(401).json({ message: "Invalid token" });
    }

    // Erreur inattendue → 500, pas 401
    console.error("❌ Unexpected auth error:", error.message);
    return res.status(500).json({ message: "Authentication error" });
  }
};