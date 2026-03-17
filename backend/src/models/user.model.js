import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true, // optionnel mais conseillé
    },
  },
  {
    timestamps: true, // corrige le typo
  }
);

// Middleware avant sauvegarde pour hasher le mot de passe
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // pas besoin de next
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);

export default User;