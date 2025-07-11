import mongoose from "mongoose";

const hostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "host",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  village: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  idProofImage: {
    type: String,
    required: true,
  },
  homestayImages: {
    type: [String], // array of image URLs or filenames
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  listings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stay",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Host = mongoose.model("Host", hostSchema, "host");
export default Host;
