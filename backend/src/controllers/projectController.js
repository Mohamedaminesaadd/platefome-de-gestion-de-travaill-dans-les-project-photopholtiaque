import Project from '../models/project.js';

// CREATE
export const createProject = async (req, res) => {
    console.log("BODY:", req.body);
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ ALL
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('idEquipe')
      .populate('idChefProject');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ONE
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('idEquipe')
      .populate('idChefProject');
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
export const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }
    res.status(200).json({ message: "Projet supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//getPrject for pie chart


// GET STATS FOR PIE CHART
export const getProjectStats = async (req, res) => {
  try {
    const stats = await Project.aggregate([
      
      // 1. Group by statut
      {
        $group: {
          _id: "$statut",
          count: { $sum: 1 },
          totalBudget: { $sum: "$budgetTotale" },
          totalConsumed: { $sum: "$budgetConsomme" }
        }
      },

      // 2. Format output
      {
        $project: {
          _id: 0,
          statut: "$_id",
          count: 1,
          totalBudget: 1,
          totalConsumed: 1
        }
      }
    ]);

    // 3. Total projets
  const totalProjects = await Project.countDocuments();

    // 4. Construire réponse propre
    const byStatus = {};
    let budgetTotal = 0;
    let budgetConsumed = 0;

    stats.forEach(s => {
      byStatus[s.statut] = s.count;
      budgetTotal += s.totalBudget;
      budgetConsumed += s.totalConsumed;
    });

    res.status(200).json({
      total: totalProjects,
      byStatus,
      budget: {
        total: budgetTotal,
        consumed: budgetConsumed
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};