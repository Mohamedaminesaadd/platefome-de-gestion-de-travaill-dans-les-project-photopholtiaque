import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // --- validation de base
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // --- vérifier si l'utilisateur existe déjà
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    // --- hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- créer et enregistrer l'utilisateur
    const newUser = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default registerUser;