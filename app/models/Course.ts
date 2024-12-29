// app/models/Course.ts
import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxLength: 200
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    maxLength: 5000
  },
  instructor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  content: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: ['text', 'video', 'quiz']
    },
    content: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: true
    }
  }],
  thumbnail: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  published: { 
    type: Boolean, 
    default: false,
    index: true
  },
  enrollmentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better query performance
courseSchema.index({ title: 'text', description: 'text' }) // Text search
courseSchema.index({ createdAt: -1 }) // Sorting by creation date
courseSchema.index({ price: 1 }) // Price filtering
courseSchema.index({ rating: -1 }) // Rating-based sorting

// Virtual for average rating
courseSchema.virtual('averageRating').get(function() {
  return this.totalReviews > 0 ? this.rating / this.totalReviews : 0
})

// Pre-save middleware to ensure order numbers are sequential
courseSchema.pre('save', function(next) {
  if (this.content) {
    this.content.forEach((item, index) => {
      item.order = index
    })
  }
  next()
})

// Make sure the model hasn't been compiled yet
export const Course = mongoose.models.Course || mongoose.model('Course', courseSchema)
