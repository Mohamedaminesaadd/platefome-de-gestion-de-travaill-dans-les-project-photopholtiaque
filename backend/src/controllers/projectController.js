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