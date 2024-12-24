import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true,
    minlength: [2, 'Display name must be at least 2 characters long'],
    maxlength: [50, 'Display name cannot exceed 50 characters'],
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
  },
  avatar: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters'],
  },
  website: {
    type: String,
    trim: true,
    maxlength: [200, 'Website URL cannot exceed 200 characters'],
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Allow empty string
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
      },
      message: 'Please enter a valid URL',
    },
  },
  socialLinks: {
    twitter: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    newsletterSubscription: {
      type: Boolean,
      default: false,
    },
    displayEmail: {
      type: Boolean,
      default: false,
    },
  },
  expertise: [{
    type: String,
    trim: true,
  }],
  interests: [{
    type: String,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the updatedAt timestamp
profileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for full name
profileSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
});

// Instance method to sanitize profile for public view
profileSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  if (!obj.preferences.displayEmail) {
    delete obj.email;
  }
  return obj;
};

export default mongoose.models.Profile || mongoose.model('Profile', profileSchema);
