import Phase from '../models/phase.js';
import Project from '../models/project.js';
import Tache from '../models/tache.js';

// ✅ Helpers de conversion
function mapPriorite(priorite) {
  const map = {
    'BASSE':    'low',
    'MOYENNE':  'medium',
    'HAUTE':    'high',
    'CRITIQUE': 'high',
  };
  return map[priorite] ?? 'medium';
}

function mapComplexite(complexite) {
  const map = {
    'BASSE':   'low',
    'MOYENNE': 'medium',
    'ELEVEE':  'high',
  };
  return map[complexite] ?? 'medium';
}

// ================= CREATE =================
export const createPhase = async (req, res) => {
  try {
    const { projectId } = req.params;

    console.log("Project ID:", projectId);
    console.log("Request Body:", req.body);

    if (!projectId) {
      return res.status(400).json({ message: "❌ projectId is required in params" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    if (req.body.statut) {
      req.body.statut = req.body.statut.toUpperCase().replace(/_/g, " ");
    }

    if (!req.body.nom || !req.body.order) {
      return res.status(400).json({ message: "❌ nom et order sont obligatoires" });
    }

    const { taches, ...phaseData } = req.body;

    const phase = new Phase({
      ...phaseData,
      idProject: projectId,
    });

    const savedPhase = await phase.save();

    // ✅ Création des tâches avec le bon mapping
    if (taches && taches.length > 0) {
      const defaultDeadline = phaseData.dateFinPrevue
        ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const tacheDocs = taches.map(t => ({
        title:          t.titre        ?? t.title ?? 'Sans titre',
        estimatedHours: t.heureEstimee ?? t.estimatedHours ?? 0,
        phase:          savedPhase._id,
        deadline:       defaultDeadline,
        description:    t.description  ?? '',
        status:         'todo',
        priority:       mapPriorite(t.priorite),
        complexity:     mapComplexite(t.complexite),
        assignedTo:     null,
      }));

      await Tache.insertMany(tacheDocs);
    }

    return res.status(201).json({
      message: "✅ Phase et tâches créées avec succès",
      data: savedPhase
    });

  } catch (error) {
    console.error("❌ Erreur createPhase:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL BY PROJECT =================
export const getPhasesByProject = async (req, res) => {
  try {
    const phases = await Phase.find({
      idProject: req.params.projectId
    }).sort({ order: 1 });

    res.status(200).json(phases);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.toString(),
      projectId: req.params.projectId
    });
  }
};

// ================= GET ONE =================
export const getPhaseById = async (req, res) => {
  try {
    const phase = await Phase.findById(req.params.id).populate('idProject');

    if (!phase) {
      return res.status(404).json({ message: "Phase not found" });
    }

    res.status(200).json(phase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE =================
export const updatePhase = async (req, res) => {
  try {
    const updated = await Phase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Phase not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ================= DELETE =================
export const deletePhase = async (req, res) => {
  try {
    const deleted = await Phase.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Phase not found" });
    }

    // ✅ Supprimer aussi les tâches liées avec le bon champ "phase"
    await Tache.deleteMany({ phase: req.params.id });

    res.status(200).json({ message: "✅ Phase et tâches supprimées avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL =================
export const getAllPhases = async (req, res) => {
  try {
    const phases = await Phase.find().populate('idProject');
    res.status(200).json(phases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};