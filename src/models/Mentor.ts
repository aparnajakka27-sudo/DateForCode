import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubmittedProject {
  projectName: string;
  techStack: string;
  githubLink?: string;
  liveDemoLink?: string;
  description: string;
  zipFileName?: string;
  status: 'pending' | 'eligible' | 'not_eligible';
  submittedAt: Date;
}

export interface IMentorStatus extends Document {
  userId: string;
  activePortal: 'student' | 'mentor';
  level1Completed: boolean;
  submittedProjects: ISubmittedProject[];
  level2Completed: boolean;
  assessmentAttempts: {
    score: number;
    passed: boolean;
    questionsSelected: number[]; // array of question IDs
    attemptedAt: Date;
  }[];
  isMentorApproved: boolean;
  mentorApprovalDate?: Date;
}

const SubmittedProjectSchema = new Schema<ISubmittedProject>({
  projectName: { type: String, required: true },
  techStack: { type: String, required: true },
  githubLink: { type: String },
  liveDemoLink: { type: String },
  description: { type: String, required: true },
  zipFileName: { type: String },
  status: { type: String, enum: ['pending', 'eligible', 'not_eligible'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now }
});

const MentorStatusSchema = new Schema<IMentorStatus>({
  userId: { type: String, required: true, unique: true },
  activePortal: { type: String, enum: ['student', 'mentor'], default: 'student' },
  level1Completed: { type: Boolean, default: false },
  submittedProjects: [SubmittedProjectSchema],
  level2Completed: { type: Boolean, default: false },
  assessmentAttempts: [{
    score: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    questionsSelected: [{ type: Number }],
    attemptedAt: { type: Date, default: Date.now }
  }],
  isMentorApproved: { type: Boolean, default: false },
  mentorApprovalDate: { type: Date }
});

// Ensure global scope reuse for Next.js hot reload safety
const Mentor: Model<IMentorStatus> = mongoose.models.Mentor || mongoose.model<IMentorStatus>('Mentor', MentorStatusSchema);

export default Mentor;
