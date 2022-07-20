import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  userId: String,
  description: String,
  time: String,
  repeatedTimes: Number,
});

export default mongoose.model('Reminders', schema);
