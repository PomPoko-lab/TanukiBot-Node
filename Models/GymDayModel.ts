import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  userId: String,
  dayNumber: Number,
  dayCategory: String,
  routine: Array,
  skippedLast: Boolean,
});

export default mongoose.model('GymDays', schema);
