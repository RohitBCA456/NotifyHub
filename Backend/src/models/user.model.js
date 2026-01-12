import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },

  imageUrl: { type: String },

  email: { type: String, required: true, unique: true },

  sessionId: { type: String, required: true },

  webToken: { type: String },

  createdAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  this.sessionId = await bcrypt.hash(this.sessionId, 10);
  next();
});

userSchema.methods.generateWebToken = function () {
  return JWT.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

export const User = mongoose.model("User", userSchema);
