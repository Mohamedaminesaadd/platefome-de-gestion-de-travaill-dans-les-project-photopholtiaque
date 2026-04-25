import Tache from "../models/tache.js";
import Phase from "../models/phase.js";
import User from "../models/user.model.js";

/* ================= CREATE ================= */
export const createTache = async (req, res) => {
  try {
    const {
      title,          // ✅ MongoDB: "title"
      description,
      deadline,       // ✅ MongoDB: "deadline"
      estimatedHours, // ✅ MongoDB: "estimatedHours"
      priority,       // ✅ MongoDB: "priority"
      complexity,     // ✅ MongoDB: "complexity"
      cost,
      phase,          // ✅ MongoDB: "phase"
      assignedTo      // ✅ MongoDB: "assignedTo"
    } = req.body;

    if (!title || !deadline || !phase) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    const phaseDoc = await Phase.findById(phase);
    if (!phaseDoc) {
      return res.status(404).json({ message: "Phase introuvable" });
    }

    if (assignedTo) {
      const user = await User.findById(assignedTo);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }
    }

    const tache = await Tache.create({
      title,
      description,
      deadline,
      estimatedHours: estimatedHours || 0,
      actualHours: 0,
      priority,
      complexity,
      cost: cost || 0,
      phase,
      assignedTo: assignedTo || null
    });

    res.status(201).json(tache);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= READ ALL ================= */
export const getAllTaches = async (req, res) => {
  try {
    const taches = await Tache.find()
      .populate("phase", "nom idProject")                 // ✅ MongoDB: "phase"
      .populate("assignedTo", "username email status");   // ✅ MongoDB: "assignedTo"

    res.json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= READ BY ID ================= */
export const getTacheById = async (req, res) => {
  try {
    const tache = await Tache.findById(req.params.id)
      .populate("phase", "nom idProject")
      .populate("assignedTo", "username email status");

    if (!tache) {
      return res.status(404).json({ message: "Tache introuvable" });
    }

    res.json(tache);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE ================= */
export const updateTache = async (req, res) => {
  try {
    const updated = await Tache.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Tache introuvable" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE ================= */
export const deleteTache = async (req, res) => {
  try {
    const deleted = await Tache.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Tache introuvable" });
    }

    res.json({ message: "Tache supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= ASSIGNER ================= */
export const assignTaches = async (req, res) => {
  try {
    const { taskIds, technicianId } = req.body;

    if (!taskIds || !technicianId) {
      return res.status(400).json({ message: "taskIds et technicianId requis" });
    }

    const user = await User.findById(technicianId);
    if (!user) {
      return res.status(404).json({ message: "Technicien introuvable" });
    }

    await Tache.updateMany(
      { _id: { $in: taskIds } },
      { assignedTo: technicianId } // ✅ MongoDB: "assignedTo"
    );

    res.json({ message: "Taches assignées avec succès" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE MANY ================= */
export const deleteManyTaches = async (req, res) => {
  try {
    const { taskIds } = req.body;

    await Tache.deleteMany({ _id: { $in: taskIds } });

    res.json({ message: "Taches supprimées" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET BY PHASE ================= */
export const getTachesByPhase = async (req, res) => {
  try {
    const taches = await Tache.find({ phase: req.params.phaseId }) // ✅ MongoDB: "phase"
      .populate("assignedTo", "username email status");

    res.json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET BY USER ================= */
export const getTachesByUser = async (req, res) => {
  try {
    const taches = await Tache.find({ assignedTo: req.params.userId }) // ✅ MongoDB: "assignedTo"
      .populate("phase", "nom idProject");

    res.json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET BY PROJECT ================= */
export const getTachesByProject = async (req, res) => {
  try {
    // Cherche les phases du projet — vérifie que ton modèle Phase utilise bien "idProject" ou "project"
    const phases = await Phase.find({ idProject: req.params.projectId });

    const phaseIds = phases.map(p => p._id);

    const taches = await Tache.find({
      phase: { $in: phaseIds } // ✅ MongoDB: "phase"
    }).populate("assignedTo", "username email status");

    res.json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//==================estimation ML =================
//==================recommandation ML =================
//==================priorisation ML =================
