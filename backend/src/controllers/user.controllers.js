import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { generateToken } from "../utils/jwt.js";
import { ROLES } from "../models/user.model.js";

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Vérifier si l'email existe (insensible à la casse)
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Vérifier si le username existe (insensible à la casse)
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // Validation du rôle
    const validRoles = Object.values(ROLES);
    const userRole = role && validRoles.includes(role.toLowerCase()) 
      ? role.toLowerCase() 
      : ROLES.TECHNICIAN;

    // 🔥 CORRECTION : On ne hache PAS ici ! 
    // Le fichier user.model.js s'en charge avec userSchema.pre('save')
    const newUser = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: password, // <-- On envoie le texte clair
      role: userRole,
    });

    console.log(`✅ Utilisateur créé : ${newUser.username} avec le rôle ${newUser.role}`);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    // Recherche de l'utilisateur
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      console.log(`❌ Login échoué : Utilisateur ${username} non trouvé`);
      return res.status(404).json({ message: "User not found" });
    }

    // Comparaison du mot de passe (Texte clair VS Hash en base)
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log(`❌ Login échoué : Mauvais mot de passe pour ${username}`);
      return res.status(401).json({ message: "Invalid password" });
    }

    // Génération du Token JWT
    const token = generateToken(user);

    console.log(`🚀 Login réussi : ${user.username} (${user.role})`);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= FORGOT & RESET (Simplifiés) =================

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1h
    await user.save();

    // Note: Assure-toi que process.env.EMAIL_USER est configuré
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset",
      text: `Lien de réinitialisation : http://localhost:4200/reset/${token}`,
    });

    res.json({ message: "Reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email" });
  }
};

const resetPassword = async (req, res) => {
  const { newPassword, token } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Token invalid or expired" });

    // 🔥 Le middleware pre('save') hachera automatiquement newPassword
    user.password = newPassword; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { registerUser, loginUser, forgotPassword, resetPassword };