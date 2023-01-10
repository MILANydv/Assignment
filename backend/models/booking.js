// import { Schema, model } from "mongoose";
// const bookingSchema = new Schema(
//   {
//     businessItems: [
//       {
//         slug: { type: String, required: true },
//         name: { type: String, required: true },
//         address: { type: String, required: true },
//         quantity: { type: Number, required: true },

//         image: { type: String, required: true },
//         business: {
//           type: Schema.Types.ObjectId,
//           ref: 'Business',
//           required: true,
//         },
//       },
//     ],
//     businessAddress: {
//       fullName: { type: String, required: true },
//       address: { type: String, required: true },
//       city: { type: String, required: true },
//       postalCode: { type: String, required: true },
//       country: { type: String, required: true }
//     },
//     paymentMethod: { type: String, required: true },
//     paymentResult: {
//       id: String,
//       status: String,
//       update_time: String,
//       email_address: String,
//     },
//     itemsPrice: { type: Number, required: true },

//     user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     isPaid: { type: Boolean, default: false },
//     paidAt: { type: Date },
//     isDelivered: { type: Boolean, default: false },
//     deliveredAt: { type: Date },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Booking = model('Booking', bookingSchema);
// export default Booking;

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  businessid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
