import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: Number,
    purpose: String,
    senderEmail: String,
    receiverEmail: String
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
