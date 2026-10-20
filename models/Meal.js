import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    required: true,
  },
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number,
  image: String,
  time: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Meal || mongoose.model('Meal', MealSchema);
