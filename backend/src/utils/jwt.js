import jwt from "jsonwebtoken";

// Générer un token
export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email }, // payload
    process.env.JWT_SECRET,              // secret
    { expiresIn: "1d" }                  // durée de validité
  );
};
