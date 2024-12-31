// app/models/Course.ts
import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: Schema.Types.ObjectId;
  content: Array<{
    title: string;
    type: 'text' | 'video' | 'quiz';
    content: string;
    order: number;
  }>;
  thumbnail?: string;
  price: number;
  published: boolean;
  enrollmentCount: number;
  rating: number;
  totalReviews: number;
  averageRating: number; // Virtual
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  instructor: {
    type: Schema.Types.ObjectId,
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
});

// Indexes for better query performance
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ price: 1 });
courseSchema.index({ rating: -1 });
courseSchema.index({ instructor: 1, published: 1 });

// Virtual for average rating
courseSchema.virtual('averageRating').get(function() {
  return this.totalReviews > 0 ? this.rating / this.totalReviews : 0;
});

// Pre-save middleware to ensure order numbers are sequential
courseSchema.pre('save', function(next) {
  if (this.content) {
    this.content.forEach((item, index) => {
      item.order = index;
    });
  }
  next();
});

export const Course = models.Course || model('Course', courseSchema);
