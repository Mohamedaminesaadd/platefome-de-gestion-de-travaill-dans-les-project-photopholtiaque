import Tache from "../models/tache.js";
import Phase from "../models/phase.js";
import User from "../models/user.model.js";

/* ================= CREATE ================= */
export const createTache = async (req, res) => {
  try {
    const {
      titre,
      description,
      dateEcheance,
      heureEstimees,
      priorite,
      complexite,
      cout,
      idPhase,
      idUtilisateur
    } = req.body;

    /* ===== VALIDATION MINIMALE ===== */
    if (!titre || !dateEcheance || !idPhase) {
      return res.status(400).json({
        message: "❌ titre, dateEcheance et idPhase sont obligatoires"
      });
    }

    /* ===== CHECK PHASE ===== */
    const phase = await Phase.findById(idPhase);
    if (!phase) {
      return res.status(404).json({ message: "❌ Phase introuvable" });
    }

    /* ===== CHECK USER ===== */
    let user = null;
    if (idUtilisateur) {
      user = await User.findById(idUtilisateur);
      if (!user) {
        return res.status(404).json({ message: "❌ User introuvable" });
      }
    }

    /* ===== CREATE ===== */
    const tache = await Tache.create({
      titre,
      description,
      dateCreation: new Date(),
      dateEcheance,
      heureEstimees: heureEstimees || 0,
      heureRelles: 0,
      priorite,
      complexite,
      cout: cout || 0,
      idPhase,
      idUtilisateur: idUtilisateur || null
    });

    return res.status(201).json({
      message: "✅ Tache créée avec succès",
      tache,
      phase: {
        id: phase._id,
        nom: phase.nom,
        idProject: phase.idProject
      },
      user: user ? { id: user._id, name: user.name } : null
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
export const getAllTaches = async (req, res) => {
  try {
    const taches = await Tache.find()
      .populate("idPhase")
      .populate("idUtilisateur");

    res.status(200).json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET BY ID ================= */
export const getTacheById = async (req, res) => {
  try {
    const tache = await Tache.findById(req.params.id)
      .populate("idPhase")
      .populate("idUtilisateur");

    if (!tache) {
      return res.status(404).json({ message: "❌ Tache introuvable" });
    }

    res.status(200).json(tache);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE ================= */
export const updateTache = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Tache.findByIdAndUpdate(
      id,
      { $set: req.body },   // ⭐ IMPORTANT
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Tache not found" });
    }

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* ================= DELETE ================= */
export const deleteTache = async (req, res) => {
  try {
    const tache = await Tache.findByIdAndDelete(req.params.id);

    if (!tache) {
      return res.status(404).json({ message: "❌ Tache introuvable" });
    }

    res.status(200).json({ message: "🗑️ Tache supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= BY PHASE ================= */
export const getTachesByPhase = async (req, res) => {
  try {
    const taches = await Tache.find({ idPhase: req.params.phaseId })
      .populate("idUtilisateur");

    res.status(200).json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= BY USER ================= */
export const getTachesByUser = async (req, res) => {
  try {
    const taches = await Tache.find({ idUtilisateur: req.params.userId })
      .populate("idPhase");

    res.status(200).json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= BY PROJECT ================= */
export const getTachesByProject = async (req, res) => {
  try {
    const phases = await Phase.find({ idProject: req.params.projectId });

    const phaseIds = phases.map(p => p._id);

    const taches = await Tache.find({
      idPhase: { $in: phaseIds }
    }).populate("idUtilisateur");

    res.status(200).json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
