const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51NlWi2SEVWrSM37UidZsbc3fHkNObsMkTTP4tJXf84ry6ZM84AoCLTUuavDJ6OQXk8jbs7AfkBI7GrwgROcLPqUV00hFjcnBLS"
);
router.post("/bookcar", async (req, res) => {
  const { token } = req.body;
  
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    
    const payment = await stripe.paymentIntents.create(
      {
        amount: req.body.totalAmount * 100,
        currency: "inr",
        customer: customer.id,
        receipt_email: token.email
      }
    );
    
    if (payment) {
      req.body.transactionId = payment.id;
      const newbooking = new Booking(req.body);
      await newbooking.save();
      const car = await Car.findOne({ _id: req.body.car });
      console.log(req.body.car);
      car.bookedTimeSlots.push(req.body.bookedTimeSlots);

      await car.save();
      res.send("Your booking is successfull");
    } else {
      return res.status(400).json(error);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});


router.get("/getallbookings", async(req, res) => {

    try {

        const bookings = await Booking.find().populate('car')
        res.send(bookings)
        
    } catch (error) {
        return res.status(400).json(error);
    }
  
});


module.exports = router;
