// user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export const ROLES = {
  ADMIN:           'admin',
  DIRECTOR:        'director',
  TECHNICIAN:      'technician',
  PROJECT_MANAGER: 'project_manager',
};

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: 'technician'
  },

  status: { type: String, default: 'inactive' },

  // 🔥 AJOUTS FRONTEND
  specialite: { type: String },

  disponible: { type: Boolean, default: true },

  tachesEnCours: { type: Number, default: 0 },

  efficacite: { type: [Number], default: [] },

  tacheHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tache' }],
  projectHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],

  resetPasswordToken: String,
  resetPasswordExpires: Date
});

// Middleware pour hasher password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model('User', userSchema);