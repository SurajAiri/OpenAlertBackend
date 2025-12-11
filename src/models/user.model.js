import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // only google login
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String }, // optional if using google login
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

// hash password before saving (if password is provided)
userSchema.pre("save", async function () {
  if (this.isModified("passwordHash") && this.passwordHash) {
    // Hashing logic here (e.g., using bcrypt)
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
