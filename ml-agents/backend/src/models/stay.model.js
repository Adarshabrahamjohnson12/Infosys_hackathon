import mongoose from "mongoose";

const staySchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  images: [String],
  pricePerNight: Number,
  availableDates: [String],
  capacity: Number,
  amenities: [String],
  type: {
    type: String,
    enum: ["Hut", "Cottage", "Mud House", "Tent", "Room"],
  },
  experiences: [String], // e.g. farming, pottery, folk music
  host: { type: mongoose.Schema.Types.ObjectId, ref: "Host" },
  ratings: {
    avg: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
});

export default mongoose.model("Stay", staySchema);
