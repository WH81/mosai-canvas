import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    instrument: { type: String, required: true },
    band: { type: mongoose.Schema.Types.ObjectId, ref: "Band" }
  },
  { timestamps: true }
);

export default mongoose.model("Member", MemberSchema);
