import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  description: String,
  time: Date,
  repeatedTimes: Number,
});

export default mongoose.model('Reminders', schema);
