import mongoose from 'mongoose';

const PhaseSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true },

    dateDebutPrevue: { type: Date, required: true },
    dateFinPrevue: { type: Date, required: true },

    dateDebutReelle: { type: Date },
    dateFinReelle: { type: Date },

    dureeEstimee: { type: Number, required: true },
    dureeReelle: { type: Number },

    avancement: { type: Number, default: 0 },

    statut: {
      type: String,
      enum: [
        'NOM COMMENCEE',
        'EN COURS',
        'TERMINE',
        'BLOQUE',
        'EN ATTENTE'
      ],
      default: 'EN ATTENTE'
    },

    idProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true  
    }
  },
  { timestamps: true }
);

export default mongoose.model('Phase', PhaseSchema);