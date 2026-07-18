import mongoose from 'mongoose';

const JoinRequestSchema = new mongoose.Schema({
  senderId: { type: String, required: true }, // Firebase UID of the user requesting to join
  receiverTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  leaderId: { type: String, required: true }, // Firebase UID of the team leader
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }
}, {
  timestamps: true
});

const JoinRequest = mongoose.models.JoinRequest || mongoose.model('JoinRequest', JoinRequestSchema);
export default JoinRequest;
