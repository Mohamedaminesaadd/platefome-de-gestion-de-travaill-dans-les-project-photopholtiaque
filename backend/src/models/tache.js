import mongoose from "mongoose";

const tacheSchema = new mongoose.Schema(
  {
    title: {           // ✅ était "titre"
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    deadline: {        // ✅ était "dateEcheance"
      type: Date,
      required: true,
    },
    estimatedHours: {  // ✅ était "heureEstimees"
      type: Number,
      default: 0,
    },
    actualHours: {     // ✅ était "heureRelles"
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
    },
    priority: {        // ✅ était "priorite"
      type: String,
      enum: ["low", "medium", "high"],
    },
    complexity: {      // ✅ était "complexite"
      type: String,
      enum: ["low", "medium", "high"],
    },
    cost: {            // ✅ était "cout"
      type: Number,
      default: 0,
    },
    tempsReel: {
      type: Number,
      default: 0,
    },
    tempsEstime: {
      type: Number,
      default: 0,
    },
    phase: {           // ✅ était "idPhase"
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phase",
      required: true,
    },
    assignedTo: {      // ✅ était "idUtilisateur"
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Tache = mongoose.model("Tache", tacheSchema);
export default Tache;