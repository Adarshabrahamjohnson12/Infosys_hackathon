import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  stay: { type: mongoose.Schema.Types.ObjectId, ref: "Stay" },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "Host" },
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  totalAmount: Number,
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "pending"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Booking", bookingSchema);
