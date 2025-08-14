import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'username required'],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, 'email required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please Fill Valid Email'],
    },
    password: {
      type: String,
      required: [true, 'password required'],
      minLength: 6,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
