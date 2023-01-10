// import express from "express";
// import expressAsyncHandler from "express-async-handler";
// import Booking from "../models/booking.js";
// import Product from "../models/productModel.js";
// import User from "../models/userModel.js";
// import { isAuth,isAdmin } from "../utils.js";
// const BookingRouter = express.Router();
// BookingRouter.get(
//   '/',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const bookings = await Booking.find().populate('user', 'name');
//     res.send(bookings);
//   })
// );



// BookingRouter.post(
//   '/',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const newBooking = new Booking({
//       businessItems: req.body.businessItems.map((x) => ({ ...x, business: x._id })),
//       bookingAddress: req.body.bookingAddress,
//       paymentMethod: req.body.paymentMethod,
//       user: req.user._id,
//     });

//     const booking = await newBooking.save();
//     res.status(201).send({ message: 'New Booking Created', booking });
//   })
// );




// BookingRouter.get(
//   '/summary',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const booking = await Booking.aggregate([
//       {
//         $group: {
//           _id: null,
//           numOrders: { $sum: 1 },
//           totalSales: { $sum: '$totalPrice' },
//         },
//       },
//     ]);
//     const users = await User.aggregate([
//       {
//         $group: {
//           _id: null,
//           numUsers: { $sum: 1 },
//         },
//       },
//     ]);
//     const dailyBookings = await Booking.aggregate([
//       {
//         $group: {
//           _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
//           bookings: { $sum: 1 },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);
//     res.send({ users, booking, dailyBookings,  });
//   })
// );

// BookingRouter.get(
//   '/mine',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const bookings = await Booking.find({ user: req.user._id });
//     res.send(bookings);
//   })
// );


// BookingRouter.get(
//   '/:id',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const booking = await Booking.findById(req.params.id);
//     if (booking) {
//       res.send(booking);
//     } else {
//       res.status(404).send({ message: 'Order Not Found' });
//     }
//   })
// );
// BookingRouter.put(
//   '/:id/deliver',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const booking = await Booking.findById(req.params.id);
//     if (booking) {
//       booking.isDelivered = true;
//       booking.deliveredAt = Date.now();
//       await booking.save();
//       res.send({ message: 'Order Delivered' });
//     } else {
//       res.status(404).send({ message: 'Order Not Found' });
//     }
//   })
// );

// BookingRouter.put(
//   '/:id/pay',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const booking = await Booking.findById(req.params.id).populate(
//       'user',
//       'email name'
//     );
//     if (booking) {
//       booking.isPaid = false;
//       booking.paidAt = Date.now();
//       booking.paymentResult = {
//         id: req.body.id,
//         status: req.body.status,
//         update_time: req.body.update_time,
//         email_address: req.body.email_address,
//       };

//       const updatedBooking = await booking.save();
   
//       res.send({ message: 'Order Paid', order: updatedBooking });
//     } else {
//       res.status(404).send({ message: 'Order Not Found' });
//     }
//   })
// );

// BookingRouter.delete(
//   '/:id',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const booking = await Booking.findById(req.params.id);
//     if (booking) {
//       await booking.remove();
//       res.send({ message: 'Order Deleted' });
//     } else {
//       res.status(404).send({ message: 'Order Not Found' });
//     }
//   })
// );

// export default BookingRouter

import express from "express";
import expressAsyncHandler from "express-async-handler";
import Booking from "../models/booking.js";
import { isAuth, isAdmin } from "../utils.js";
const BookingRouter = express.Router();



BookingRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { page, pageSize } = req.query;
    const booking = await Booking.find()
      .skip(pageSize * ((page || 1) -1 ))
      .limit(pageSize )
      .populate(["businessid", "userId"]);
    res.send(booking);
  })
);

// BookingRouter.get(
//   "/",
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const { page, pageSize } = req.query;
//     const booking = await Booking.find()
//       .skip(pageSize * ((page || 1) -1 ))
//       .limit(pageSize || 5)
//       .populate(["businessid", "userId"]);
//       const countbookings = await Booking.countDocuments();
//     res.send({booking,countbookings,
//             page,
//             pages: Math.ceil(countbookings / pageSize)});
//   })
// );

const PAGE_SIZE = 5;

// BookingRouter.get(
//   "/",
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const page = query.page || 1;
//     const pageSize = query.pageSize || PAGE_SIZE;

//     const booking = await Booking.find()
//       .skip(pageSize * (page - 1))
//       .limit(pageSize)
//       .populate(["businessid", "userId"]);
//     const countbookings = await Booking.countDocuments();
//     res.send({
//       booking,
//       countbookings,
//       page,
//       pages: Math.ceil(countbookings / pageSize),
//     });
//   })
// );

BookingRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { businessid, mobile, address, date, time } = req.body;

    const book = new Booking({
      businessid,
      mobile,
      address,
      date,
      time,
      userId: req.user._id,
    });

    book
      .save()
      .then((response) => {
        res.send({
          ...response._doc,
          success: true,
          message: "Booking Successful",
        });
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message: err?.message || "Failed to book",
        });
      });
  })
);

BookingRouter.get(
  "/me",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { page, pageSize } = req.query;
    const booking = await Booking
      .where({"userId": req.user?._id})
      .skip(pageSize * ((page || 1) - 1))
      .limit(pageSize)
      .populate(["businessid", "userId"]);
    res.send(booking);
  })
);
BookingRouter.delete('/:id',isAuth,isAdmin,expressAsyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (booking) {
    await booking.remove();
    res.send({ message: 'Booking Deleted' });
  } else {
    res.status(404).send({ message: 'Booking Not Found' });
  }
})
);


export default BookingRouter;
