import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
