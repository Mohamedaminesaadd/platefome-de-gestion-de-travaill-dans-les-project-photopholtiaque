import mongoose from "mongoose";

const TacheSchema = new mongoose.Schema(
  {
    // 🔹 Infos principales
    titre: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String
    },

    // 📅 Dates
    dateCreation: {
      type: Date,
      default: Date.now
    },

    dateEcheance: {
      type: Date,
      required: true
    },

    dateDebut: {
      type: Date
    },

    dateFin: {
      type: Date
    },

    // ⏱ Temps
    heureEstimees: {
      type: Number,
      required: true,
      min: 0
    },

    heureRelles: {
      type: Number,
      default: 0,
      min: 0
    },

    // 🔥 Statut
    statut: {
      type: String,
      enum: [
        "A FAIRE",
        "EN COURS",
        "EN REVUE",
        "ANNULEE",
        "BLOQUEE",
        "TERMINEE"
      ],
      default: "A FAIRE"
    },

    // 🔥 Priorité (comme Project)
    priorite: {
      type: String,
      enum: ["BASSE", "MOYENNE", "HAUTE", "CRITIQUE"],
      default: "MOYENNE"
    },

    // 🔥 Complexité
    complexite: {
      type: String,
      enum: ["BASSE", "MOYENNE", "ELEVEE"],
      default: "MOYENNE"
    },

    // 💰 Coût
    cout: {
      type: Number,
      default: 0,
      min: 0
    },
    

    // 🔗 Relation avec Phase
    idPhase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phase",
      required: true,
      index: true
    },

    // 🔗 Relation avec User
    idUtilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

// 🔥 Export
const Tache = mongoose.model("Tache", TacheSchema);
export default Tache;