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

    if (!titre || !dateEcheance || !idPhase) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    const phase = await Phase.findById(idPhase);
    if (!phase) {
      return res.status(404).json({ message: "Phase introuvable" });
    }

    let user = null;
    if (idUtilisateur) {
      user = await User.findById(idUtilisateur);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }
    }

    const tache = await Tache.create({
      titre,
      description,
      dateEcheance,
      heureEstimees: heureEstimees || 0,
      heureRelles: 0,
      priorite,
      complexite,
      cout: cout || 0,
      idPhase,
      idUtilisateur: idUtilisateur || null
    });

    res.status(201).json(tache);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= READ =================
export const getAllTaches = async (req, res) => {
  try {
    const taches = await Tache.find()
      .populate("idPhase", "nom")
      .populate("idUtilisateur", "name");

    res.json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//================== READ BY ID =================
export const getTacheById = async (req, res) => {
  try {
    const tache = await Tache.findById(req.params.id)
      .populate("idPhase", "nom")
      .populate("idUtilisateur", "name");

    if (!tache) {
      return res.status(404).json({ message: "Tache introuvable" });
    }

    res.json(tache);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//================== UPDATE =================
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

//================== DELETE =================
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

//==================Assigner une tâche à un utilisateur =================

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
      { idUtilisateur: technicianId }
    );

    res.json({ message: "Taches assignées avec succès" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//================Delete all task ================
export const deleteManyTaches = async (req, res) => {
  try {
    const { taskIds } = req.body;

    await Tache.deleteMany({ _id: { $in: taskIds } });

    res.json({ message: "Taches supprimées" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//==================Gettache by phase by phaseId =================
export const getTachesByPhase = async (req, res) => {
  try {
    const taches = await Tache.find({ idPhase: req.params.phaseId })
      .populate("idUtilisateur", "name");

    res.json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//==================Gettache by user by userId =================
export const getTachesByUser = async (req, res) => {
  try {
    const taches = await Tache.find({ idUtilisateur: req.params.userId })
      .populate("idPhase", "nom");

    res.json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//==================GET BY PTOJECT ID =================
export const getTachesByProject = async (req, res) => {
  try {
    const phases = await Phase.find({ idProject: req.params.projectId });

    const phaseIds = phases.map(p => p._id);

    const taches = await Tache.find({
      idPhase: { $in: phaseIds }
    }).populate("idUtilisateur", "name");

    res.json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//==================estimation ML =================
//==================recommandation ML =================
//==================priorisation ML =================
