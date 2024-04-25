const express = require('express');
const router = express.Router();
const CampaignModel = require('../model/campginModel');
const Razorpay = require('razorpay');


router.post("/create-checkout-session", async (req, res) => {
  const { amount, userId, pid } = req.body;
  try {
    console.log(pid)
    const campaign = await CampaignModel.findById(pid);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: amount, 
      currency: "INR",
      receipt: `donation-${userId}-${pid}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(400).json({ error: 'Failed to create order' });
    }

    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      status: order.status
    });

  } catch (error) {
    console.error('Error donating:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router