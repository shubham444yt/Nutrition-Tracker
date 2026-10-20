import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  fullName: String,
  email: String,
  currentWeight: Number,
  targetWeight: Number,
  dailyCalorieGoal: Number,
  healthGoal: {
    type: String,
    enum: ["Weight Loss", "Muscle Build", "Maintain", "Improve Health"],
  },
  profileImage: String, // Base64 or URL
  bio: String,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
