// app/models/Course.ts
import mongoose, { Schema, model, models } from 'mongoose';

export interface IContentBlock {
  id: string;
  type: 'text' | 'video' | 'quiz' | 'assignment';
  title: string;
  content: string;
  order: number;
  metadata?: Record<string, any>;
}

export interface IResource {
  id: string;
  title: string;
  type: string;
  url: string;
  description?: string;
  uploadDate: Date;
}

export interface ICourse {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  status: 'draft' | 'published' | 'archived';
  contentBlocks: IContentBlock[];
  resources: IResource[];
  thumbnail?: string;
  category: string;
  tags: string[];
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

const ContentBlockSchema = new Schema<IContentBlock>({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['text', 'video', 'quiz', 'assignment']
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  order: { type: Number, required: true },
  metadata: { type: Map, of: Schema.Types.Mixed }
});

const ResourceSchema = new Schema<IResource>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  description: String,
  uploadDate: { type: Date, default: Date.now }
});

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  status: { 
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  contentBlocks: [ContentBlockSchema],
  resources: [ResourceSchema],
  thumbnail: String,
  category: { type: String, required: true },
  tags: [String],
  duration: { type: Number, required: true },
  level: { 
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  prerequisites: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
CourseSchema.index({ title: 'text', description: 'text' });
CourseSchema.index({ category: 1, status: 1 });
CourseSchema.index({ instructor: 1, status: 1 });
CourseSchema.index({ tags: 1 });

// Middleware to update timestamps
CourseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for course URL
CourseSchema.virtual('url').get(function() {
  return `/courses/${this._id}`;
});

export default models.Course || model<ICourse>('Course', CourseSchema);
