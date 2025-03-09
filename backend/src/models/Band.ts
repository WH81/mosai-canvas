import mongoose from "mongoose";

const BandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    genre: { type: String, required: true },
    formedYear: { type: Number, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }]
  },
  { timestamps: true }
);

export default mongoose.model("Band", BandSchema);
