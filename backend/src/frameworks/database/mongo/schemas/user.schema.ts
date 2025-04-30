import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    wallet: { type: String, required: true },
    nickname: { type: String, required: false },
    bio: { type: String, required: false },
    created_at: { type: Number, required: false },
    last_login: { type: Number, required: false }
  },
  { collection: "user" }
);

const BuilderModel = mongoose.model("User", userSchema);

export default BuilderModel;