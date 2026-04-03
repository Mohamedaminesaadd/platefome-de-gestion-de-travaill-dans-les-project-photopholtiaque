import mongoose from 'mongoose';

// 🔹 Enum Statut
const EnumStatutProject = [
  'PLANIFIE',
  'EN COURS',
  'EN RETARD',
  'SUSPENDU',
  'TERMINE',
  'ANNULE'
];

// 🔹 Enum Priorité
const EnumPriorite = [
  'BASSE',
  'MOYENNE',
  'HAUTE',
  'CRITIQUE'
];

// 🔹 Schema
const ProjectSchema = new mongoose.Schema({
  
  // Identification
  codeProject: {
    type: String,
    required: true,
    unique: true
  },
  nom: {
    type: String,
    required: true
  },
  description: {
    type: String
  },

  // Dates
  dateDebut: {
    type: Date,
    required: true
  },
  dateFinPrevue: {
    type: Date,
    required: true
  },
  dateFinReelle: {
    type: Date
  },

  // Financier
  budgetTotale: {
    type: Number,
    required: true
  },
  budgetConsomme: {
    type: Number,
    default: 0
  },

  // Localisation
  coordonnesGPS: {
    type: String
  },
  adresse: {
    type: String
  },
  ville: {
    type: String
  },
  codePostal: {
    type: String
  },

  // Etat
  priorite: {
    type: String,
    enum: EnumPriorite,
    required: true
  },
  statut: {
    type: String,
    enum: EnumStatutProject,
    default: 'PLANIFIE'
  },

  // Relations
  idEquipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipe'
  },
  idChefProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, { timestamps: true }); // ajoute createdAt / updatedAt

const Project = mongoose.model('Project', ProjectSchema);

export default Project;