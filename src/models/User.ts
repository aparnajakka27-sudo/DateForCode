import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  // Authentication
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false }, // Hashed
  provider: { type: String, enum: ['email', 'google', 'github', 'linkedin'], default: 'email' },
  providerId: { type: String },
  emailVerified: { type: Boolean, default: false },
  accountStatus: { type: String, enum: ['active', 'suspended', 'banned'], default: 'active' },

  // Profile
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  gender: { type: String },
  dateOfBirth: { type: Date },
  country: { type: String, default: '' },
  state: { type: String, default: '' },
  city: { type: String, default: '' },
  timeZone: { type: String, default: 'UTC' },
  preferredLanguage: { type: String, default: 'en' },

  // Education
  college: { type: String, default: '' },
  degree: { type: String, default: '' },
  graduationYear: { type: String, default: '' },

  // Coding Information
  primaryLanguage: { type: String, default: '' },
  secondaryLanguages: [{ type: String }],
  skills: [{ type: String }],
  techStack: [{ type: String }],
  experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Beginner' },
  githubUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  portfolioUrl: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },

  // Platform Data
  role: { type: String, enum: ['user', 'premium', 'mentor', 'moderator', 'owner'], default: 'user' },
  isPremium: { type: Boolean, default: false },
  codingStreak: { type: Number, default: 0 },
  totalMatches: { type: Number, default: 0 },
  communitiesJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
  communitiesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
  projectsUploaded: { type: Number, default: 0 },
  codingRoomsJoined: { type: Number, default: 0 },
  codingRoomsCreated: { type: Number, default: 0 },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reputationScore: { type: Number, default: 0 },
  xpPoints: { type: Number, default: 0 },
  badges: [{ type: String }],
  achievements: [{ type: String }],

  // Activity
  lastLogin: { type: Date },
  lastActiveTime: { type: Date },
  loginCount: { type: Number, default: 0 },
  deviceInformation: [{ type: String }],
  browser: { type: String },
  operatingSystem: { type: String },
  ipAddressLogs: [{ type: String }], // Keeping history of IPs
  accountCreationSource: { type: String, default: 'web' },

  // Preferences
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  notificationPreferences: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    matches: { type: Boolean, default: true },
    messages: { type: Boolean, default: true }
  },
  privacySettings: {
    showProfile: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: false },
    showLocation: { type: Boolean, default: true }
  }
}, {
  timestamps: true // Automatically adds createdAt (Registration Date) and updatedAt
});

// Pre-save hook to hash password before saving to the database
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare entered password with hashed password
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if the model is already compiled (Next.js hot reload safety)
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
