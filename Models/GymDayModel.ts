import mongoose from 'mongoose';

export interface GymDay {
  userId: string;
  dayNumber: number;
  dayCategory: string;
  routine: [
    {
      exercise: string;
      sets: string;
      reps: string;
    }
  ];
  completed: boolean;
}

const schema = new mongoose.Schema<GymDay>({
  userId: String,
  dayNumber: Number,
  dayCategory: String,
  routine: Array,
  completed: Boolean,
});

export default mongoose.model<GymDay>('GymDays', schema);
