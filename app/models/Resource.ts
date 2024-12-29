// app/models/Resource.ts
import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['document', 'video', 'image', 'link', 'other']
  },
  url: { 
    type: String, 
    required: true 
  },
  fileSize: { 
    type: Number 
  },
  mimeType: { 
    type: String 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course',
    required: true 
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  status: {
    type: String,
    enum: ['processing', 'active', 'archived'],
    default: 'processing'
  },
  accessLevel: {
    type: String,
    enum: ['public', 'enrolled', 'instructor'],
    default: 'enrolled'
  },
  metadata: {
    duration: Number,
    dimensions: {
      width: Number,
      height: Number
    },
    tags: [String]
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Indexes for better query performance
resourceSchema.index({ courseId: 1, type: 1 });
resourceSchema.index({ title: 'text', description: 'text' });

// Update timestamp on save
resourceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Resource = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);

export default Resource;
