import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

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


    // --- créer et enregistrer l'utilisateur
    const newUser = await User.create({
      username,
      email: email.toLowerCase(),
      password,
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


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { registerUser, loginUser };