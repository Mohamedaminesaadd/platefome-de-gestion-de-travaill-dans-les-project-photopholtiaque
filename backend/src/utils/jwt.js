import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role }, // ✅ inclure role
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};