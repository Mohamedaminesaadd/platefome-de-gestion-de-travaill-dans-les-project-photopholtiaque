import mongoose from "mongoose";

const TacheSchema = new mongoose.Schema(
{
  // 🔹 Infos principales
  title: {
    type: String,
    trim: true
  },

  description: {
    type: String,
    default: ''
  },

  // 📅 Dates
  createdAt: {
    type: Date,
    default: Date.now
  },

  deadline: {
    type: Date,
    required: true
  },

  startDate: Date,
  endDate: Date,

  // ⏱ Temps
  estimatedHours: {
    type: Number,
    min: 0
  },

  estimatedHoursML: {
    type: Number,
    min: 0
  },

  actualHours: {
    type: Number,
    default: 0,
    min: 0
  },

  // 🔥 Statut (aligné Angular)
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  },

  // 🔥 Priorité (aligné Angular)
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },

  // 🔥 Complexité (pour ML)
  complexity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },

  // 💰 Coût
  cost: {
    type: Number,
    default: 0
  },

  tempsReel: {
  type: Number,
  default: 0 // heures réellement passées
  },
  tempsEstime: {
    type: Number,
    default: 0 // heures estimées
  },

  // 🔗 Relation Phase
  phase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Phase",
    required: true,
    index: true
  },

  // 🔗 Technicien (IMPORTANT pour frontend)
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }

},
{ timestamps: true }
);

export default mongoose.model("Tache", TacheSchema);