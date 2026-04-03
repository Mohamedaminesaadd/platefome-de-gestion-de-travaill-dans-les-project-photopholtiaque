import Phase from '../models/phase.js';
import Project from '../models/project.js';

export const createPhase = async (req, res) => {
  try {
    const { projectId} = req.params;

    console.log("Project ID:", projectId);
    console.log("Request Body:", req.body);

    // 1️⃣ Vérifier si idProject est valide
    if (!projectId) {
      return res.status(400).json({
        message: "❌ projectId is required in params"
      });
    }

    // 2️⃣ Vérifier si le project existe
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "❌ Project not found"
      });
    }

    // 3️⃣ Normalisation du statut (évite erreur enum)
    if (req.body.statut) {
      req.body.statut = req.body.statut.toUpperCase().replace(/_/g, " ");
    }

    // 4️⃣ Vérification champs obligatoires
    const requiredFields = [
      "nom",
      "order",
      "dateDebutPrevue",
      "dateFinPrevue"
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          message: `❌ Missing field: ${field}`
        });
      }
    }

    // 5️⃣ Création phase
    const phase = new Phase({
      ...req.body,
      idProject: projectId
    });

    const saved = await phase.save();

    return res.status(201).json({
      message: "✅ Phase created successfully",
      data: saved
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};


export const getPhasesByProject = async (req, res) => {
  try {
    const phases = await Phase.find({
      idProject: req.params.projectId
    }).sort({ order: 1 });

    res.status(200).json(phases);
  } catch (error) {
    res.status(500).json({ message: error.message , error: error.toString(),"projectId": req.params.projectId});
  }
};

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


export const deletePhase = async (req, res) => {
  try {
    const deleted = await Phase.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Phase not found" });
    }

    res.status(200).json({ message: "Phase deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET ALL
export const getAllPhases = async (req, res) => {
  try {
    const phases = await Phase.find().populate('idProject');
    res.status(200).json(phases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};