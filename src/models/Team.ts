import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  teamAvatar: { type: String, default: '' },
  leaderId: { type: String, required: true }, // Firebase UID of the leader
  memberIds: [{ type: String }], // Array of Firebase UIDs
  maxMembers: { type: Number, default: 4 },
  currentMembers: { type: Number, default: 1 },
  techStack: [{ type: String }],
  language: { type: String, default: 'JavaScript' },
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' },
  projectName: { type: String, default: '' },
  description: { type: String, default: '' },
  status: { type: String, enum: ['accepting', 'full'], default: 'accepting' },
}, {
  timestamps: true
});

const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);
export default Team;
