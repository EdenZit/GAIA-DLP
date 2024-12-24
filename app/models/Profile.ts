// app/models/Profile.ts
import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  description: { type: String }
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  description: { type: String }
}, { _id: false });

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  proficiency: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: true
  }
}, { _id: false });

const profileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  imageUrl: { type: String },
  education: [educationSchema],
  experience: [experienceSchema],
  skills: [skillSchema],
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    }
  }
});

profileSchema.index({ userId: 1 });

export const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
