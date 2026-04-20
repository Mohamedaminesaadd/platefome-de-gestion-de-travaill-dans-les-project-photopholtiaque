import mongoose from 'mongoose';

const PhaseSchema = new mongoose.Schema(
{
  // 🔹 Infos principales
  nom: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  order: {
    type: Number,
    required: true,
    min: 1
  },

  // 📅 Dates prévues
  dateDebutPrevue: {
    type: Date,
    required: true
  },

  dateFinPrevue: {
    type: Date,
    required: true
  },

  // 📅 Dates réelles
  dateDebutReelle: {
    type: Date,
    default: null
  },

  dateFinReelle: {
    type: Date,
    default: null
  },

  // ⏱ Durées
  dureeEstimee: {
    type: Number,
    required: true,
    min: 0
  },

  dureeReelle: {
    type: Number,
    default: 0,
    min: 0
  },

  // 📊 Avancement (0 → 100)
  avancement: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  // 🔥 Statut (corrigé + propre)
  statut: {
    type: String,
    enum: [
      'NON COMMENCEE',
      'EN COURS',
      'TERMINE',
      'BLOQUE',
      'EN ATTENTE'
    ],
    default: 'EN ATTENTE'
  },

  // 🔗 Relation Project
  idProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  }

},
{
  timestamps: true // createdAt + updatedAt
});

export default mongoose.model('Phase', PhaseSchema);