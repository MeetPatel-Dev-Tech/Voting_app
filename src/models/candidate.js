import mongoose from "mongoose";

// Candidate schema defines a political candidate and their vote records
const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  imageKey: { type: String, required: true }, // store S3 key
  votes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      votedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  voteCount: {
    type: Number,
    default: 0,
  },
});

// Exporting the Candidate model
const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;
