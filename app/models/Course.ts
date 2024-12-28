// app/models/Course.ts
import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: [{
    title: String,
    type: String,
    content: String,
    order: Number
  }],
  thumbnail: String,
  price: Number,
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export const Course = mongoose.models.Course || mongoose.model('Course', courseSchema)
