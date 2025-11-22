import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    firstName: String,
    lastName: String,
    passcode: { type: String, required: true },
    balance: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
