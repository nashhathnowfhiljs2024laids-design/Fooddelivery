import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, enum: ['customer', 'restaurant'], default: 'customer' },
  password: { type: String, required: true }, // Add password field
}, { timestamps: true });

export default mongoose.model('User', userSchema);